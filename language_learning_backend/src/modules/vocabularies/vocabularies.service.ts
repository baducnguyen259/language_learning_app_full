import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CurriculumStatus,
  LessonStatus,
  VocabularyLearningStatus,
  VocabularyStatus,
  type Prisma,
} from '../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { BulkDeleteVocabularyDto } from './dto/bulk_delete_vocabulary.dto';
import { CreateVocabularyDto } from './dto/create_vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update_vocabulary.dto';
import { VocabularyQueryDto } from './dto/vocabulary_query.dto';
import { UpdateVocabularyLearningStatusDto } from './dto/update_vocabulary_learning_status.dto';
import {
  UserVocabularyFilter,
  UserVocabularyQueryDto,
} from './dto/user_vocabulary_query.dto';
import { VocabularyReviewQueryDto } from './dto/vocabulary_review_query.dto';

@Injectable()
export class VocabulariesService {
  constructor(private readonly prisma: PrismaService) {}
  async findAllForApp(userId: string, query: UserVocabularyQueryDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const structuralVocabularyWhere: Prisma.VocabularyWhereInput = {
      status: VocabularyStatus.ACTIVE,

      ...(query.lessonId ? { lessonId: query.lessonId } : {}),

      lesson: {
        status: LessonStatus.PUBLISHED,
        chapter: { curriculum: { status: CurriculumStatus.PUBLISHED } },
        ...(query.topicId ? { topicId: query.topicId } : {}),
        ...(query.levelId || query.languageId
          ? {
              topic: {
                ...(query.levelId ? { levelId: query.levelId } : {}),
                ...(query.languageId
                  ? { level: { languageId: query.languageId } }
                  : {}),
              },
            }
          : {}),
      },
    };

    const searchedVocabularyWhere: Prisma.VocabularyWhereInput = {
      ...structuralVocabularyWhere,
      ...(search
        ? {
            OR: [
              { term: { contains: search, mode: 'insensitive' } },
              { pronunciation: { contains: search, mode: 'insensitive' } },
              { meaning: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const learningStatus =
      query.filter === UserVocabularyFilter.LEARNING
        ? VocabularyLearningStatus.LEARNING
        : query.filter === UserVocabularyFilter.MASTERED
          ? VocabularyLearningStatus.MASTERED
          : undefined;

    const filteredVocabularyWhere: Prisma.VocabularyWhereInput = {
      ...searchedVocabularyWhere,

      ...(query.filter === UserVocabularyFilter.FAVORITE
        ? {
            favorites: { some: { userId } },
          }
        : {}),
    };

    const listWhere: Prisma.UserVocabularyProgressWhereInput = {
      userId,
      vocabulary: filteredVocabularyWhere,

      ...(learningStatus ? { status: learningStatus } : {}),
    };

    const countWhere: Prisma.UserVocabularyProgressWhereInput = {
      userId,
      vocabulary: structuralVocabularyWhere,
    };

    const favoriteCountWhere: Prisma.UserVocabularyProgressWhereInput = {
      userId,
      vocabulary: {
        ...structuralVocabularyWhere,
        favorites: { some: { userId } },
      },
    };

    const select = this.getUserVocabularySelect(userId);

    const [progressRecords, total, all, learning, mastered, favorite] =
      await this.prisma.$transaction([
        this.prisma.userVocabularyProgress.findMany({
          where: listWhere,
          skip,
          take: limit,
          orderBy: [{ updatedAt: 'desc' }, { vocabularyId: 'asc' }],
          select,
        }),

        this.prisma.userVocabularyProgress.count({ where: listWhere }),
        this.prisma.userVocabularyProgress.count({ where: countWhere }),
        this.prisma.userVocabularyProgress.count({
          where: {
            ...countWhere,
            status: VocabularyLearningStatus.LEARNING,
          },
        }),

        this.prisma.userVocabularyProgress.count({
          where: {
            ...countWhere,
            status: VocabularyLearningStatus.MASTERED,
          },
        }),

        this.prisma.userVocabularyProgress.count({
          where: favoriteCountWhere,
        }),
      ]);

    return {
      items: progressRecords.map((progress) => {
        const { favorites, ...vocabulary } = progress.vocabulary;
        return {
          ...vocabulary,
          learningStatus: progress.status,
          isFavorite: favorites.length > 0,
          learnedAt: progress.createdAt,
          masteredAt: progress.masteredAt,
        };
      }),
      counts: { all, learning, mastered, favorite },

      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async findReviewQueue(userId: string, query: VocabularyReviewQueryDto) {
    const vocabularyWhere: Prisma.VocabularyWhereInput = {
      status: VocabularyStatus.ACTIVE,
      ...(query.lessonId ? { lessonId: query.lessonId } : {}),
      lesson: {
        status: LessonStatus.PUBLISHED,
        chapter: { curriculum: { status: CurriculumStatus.PUBLISHED } },
        ...(query.languageId
          ? { topic: { level: { languageId: query.languageId } } }
          : {}),
      },
    };

    const where: Prisma.UserVocabularyProgressWhereInput = {
      userId,
      vocabulary: vocabularyWhere,
    };

    const select = this.getUserVocabularySelect(userId);

    const [progressRecords, totalAvailable] = await this.prisma.$transaction([
      this.prisma.userVocabularyProgress.findMany({
        where,
        take: query.limit,
        orderBy: [
          { status: 'asc' },
          { updatedAt: 'asc' },
          { vocabularyId: 'asc' },
        ],
        select,
      }),

      this.prisma.userVocabularyProgress.count({
        where,
      }),
    ]);

    const items = progressRecords.map((progress) => {
      const { favorites, ...vocabulary } = progress.vocabulary;

      return {
        ...vocabulary,
        learningStatus: progress.status,
        isFavorite: favorites.length > 0,
        learnedAt: progress.createdAt,
        masteredAt: progress.masteredAt,
      };
    });

    return {
      items,
      totalAvailable,
      limit: query.limit,
    };
  }

  async updateLearningStatus(
    userId: string,
    vocabularyId: string,
    dto: UpdateVocabularyLearningStatusDto,
  ) {
    const now = new Date();
    return this.prisma.$transaction(async (transaction) => {
      const vocabulary = await transaction.vocabulary.findFirst({
        where: {
          id: vocabularyId,
          status: VocabularyStatus.ACTIVE,
          lesson: {
            status: LessonStatus.PUBLISHED,
            chapter: { curriculum: { status: CurriculumStatus.PUBLISHED } },
          },
        },
        select: { id: true },
      });

      if (!vocabulary) {
        throw new NotFoundException(
          'Không tìm thấy từ vựng đang được xuất bản',
        );
      }

      const currentProgress =
        await transaction.userVocabularyProgress.findUnique({
          where: { userId_vocabularyId: { userId, vocabularyId } },
          select: { masteredAt: true },
        });
      const masteredAt =
        dto.learningStatus === VocabularyLearningStatus.MASTERED
          ? (currentProgress?.masteredAt ?? now)
          : null;
      const progress = await transaction.userVocabularyProgress.upsert({
        where: { userId_vocabularyId: { userId, vocabularyId } },
        create: {
          userId,
          vocabularyId,
          status: dto.learningStatus,
          masteredAt,
        },
        update: { status: dto.learningStatus, masteredAt },
        select: { vocabularyId: true, status: true, masteredAt: true },
      });

      return {
        vocabularyId: progress.vocabularyId,
        learningStatus: progress.status,
        masteredAt: progress.masteredAt,
      };
    });
  }
  async findAllForAdmin(query: VocabularyQueryDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const lessonWhere: Prisma.LessonWhereInput = {
      ...(query.topicId ? { topicId: query.topicId } : {}),
      ...(query.levelId || query.languageId
        ? {
            topic: {
              ...(query.levelId ? { levelId: query.levelId } : {}),
              ...(query.languageId
                ? { level: { languageId: query.languageId } }
                : {}),
            },
          }
        : {}),
    };

    const hasLessonFilter =
      query.topicId !== undefined ||
      query.levelId !== undefined ||
      query.languageId !== undefined;

    const where: Prisma.VocabularyWhereInput = {
      ...(query.lessonId ? { lessonId: query.lessonId } : {}),
      ...(hasLessonFilter ? { lesson: lessonWhere } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.wordType
        ? {
            wordType: { equals: query.wordType.trim(), mode: 'insensitive' },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { term: { contains: search, mode: 'insensitive' } },
              { pronunciation: { contains: search, mode: 'insensitive' } },
              { meaning: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.vocabulary.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: this.getLessonInclude(),
      }),
      this.prisma.vocabulary.count({ where }),
    ]);
    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async findOneForAdmin(id: string) {
    const vocabulary = await this.prisma.vocabulary.findUnique({
      where: { id },
      include: this.getLessonInclude(),
    });
    if (!vocabulary) {
      throw new NotFoundException('Không tìm thấy từ vựng');
    }
    return vocabulary;
  }
  async create(dto: CreateVocabularyDto) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: dto.lessonId },
      select: { id: true },
    });
    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài học');
    }
    const term = dto.term.trim();
    await this.ensureTermIsUnique(dto.lessonId, term);
    return this.prisma.vocabulary.create({
      data: {
        term,
        pronunciation: dto.pronunciation?.trim() || null,
        meaning: dto.meaning.trim(),
        wordType: dto.wordType?.trim() || null,
        imageUrl: dto.imageUrl?.trim() || null,
        audioUrl: dto.audioUrl?.trim() || null,
        status: dto.status,
        lessonId: dto.lessonId,
      },
      include: this.getLessonInclude(),
    });
  }

  async update(id: string, dto: UpdateVocabularyDto) {
    const currentVocabulary = await this.prisma.vocabulary.findUnique({
      where: { id },
    });

    if (!currentVocabulary) {
      throw new NotFoundException('Không tìm thấy từ vựng');
    }

    const targetLessonId = dto.lessonId ?? currentVocabulary.lessonId;
    const targetTerm = dto.term?.trim() ?? currentVocabulary.term;

    if (dto.lessonId !== undefined) {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: targetLessonId },
        select: { id: true },
      });

      if (!lesson) {
        throw new NotFoundException('Không tìm thấy bài học');
      }
    }

    await this.ensureTermIsUnique(targetLessonId, targetTerm, id);

    return this.prisma.vocabulary.update({
      where: { id },
      data: {
        term: dto.term?.trim(),
        pronunciation:
          dto.pronunciation !== undefined
            ? dto.pronunciation.trim() || null
            : undefined,
        meaning: dto.meaning?.trim(),
        wordType:
          dto.wordType !== undefined ? dto.wordType.trim() || null : undefined,
        imageUrl:
          dto.imageUrl !== undefined ? dto.imageUrl.trim() || null : undefined,
        audioUrl:
          dto.audioUrl !== undefined ? dto.audioUrl.trim() || null : undefined,
        status: dto.status,
        lessonId: dto.lessonId,
      },
      include: this.getLessonInclude(),
    });
  }

  async remove(id: string) {
    await this.findOneForAdmin(id);

    return this.prisma.vocabulary.delete({ where: { id } });
  }

  async removeMany(dto: BulkDeleteVocabularyDto) {
    const existingCount = await this.prisma.vocabulary.count({
      where: { id: { in: dto.ids } },
    });

    if (existingCount !== dto.ids.length) {
      throw new NotFoundException('Một hoặc nhiều từ vựng không tồn tại');
    }

    const result = await this.prisma.vocabulary.deleteMany({
      where: { id: { in: dto.ids } },
    });

    return { deletedCount: result.count };
  }

  private async ensureTermIsUnique(
    lessonId: string,
    term: string,
    excludedId?: string,
  ): Promise<void> {
    const duplicatedVocabulary = await this.prisma.vocabulary.findFirst({
      where: {
        ...(excludedId ? { id: { not: excludedId } } : {}),
        lessonId,
        term: { equals: term, mode: 'insensitive' },
      },
      select: { id: true },
    });

    if (duplicatedVocabulary) {
      throw new ConflictException('Từ vựng đã tồn tại trong bài học này');
    }
  }
  private getUserVocabularySelect(userId: string) {
    return {
      status: true,
      masteredAt: true,
      createdAt: true,
      vocabulary: {
        select: {
          id: true,
          term: true,
          pronunciation: true,
          meaning: true,
          wordType: true,
          imageUrl: true,
          audioUrl: true,
          lessonId: true,
          favorites: { where: { userId }, take: 1, select: { id: true } },
        },
      },
    } satisfies Prisma.UserVocabularyProgressSelect;
  }
  private getLessonInclude() {
    return {
      lesson: {
        include: {
          topic: {
            include: {
              level: {
                include: {
                  language: { select: { id: true, name: true, code: true } },
                },
              },
            },
          },
        },
      },
    } as const;
  }
}
