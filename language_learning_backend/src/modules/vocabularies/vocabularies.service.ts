import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { BulkDeleteVocabularyDto } from './dto/bulk_delete_vocabulary.dto';
import { CreateVocabularyDto } from './dto/create_vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update_vocabulary.dto';
import { VocabularyQueryDto } from './dto/vocabulary_query.dto';

@Injectable()
export class VocabulariesService {
  constructor(private readonly prisma: PrismaService) {}

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
            wordType: {
              equals: query.wordType.trim(),
              mode: 'insensitive',
            },
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
          dto.wordType !== undefined
            ? dto.wordType.trim() || null
            : undefined,
        imageUrl:
          dto.imageUrl !== undefined
            ? dto.imageUrl.trim() || null
            : undefined,
        audioUrl:
          dto.audioUrl !== undefined
            ? dto.audioUrl.trim() || null
            : undefined,
        status: dto.status,
        lessonId: dto.lessonId,
      },
      include: this.getLessonInclude(),
    });
  }

  async remove(id: string) {
    await this.findOneForAdmin(id);

    return this.prisma.vocabulary.delete({
      where: { id },
    });
  }

  async removeMany(dto: BulkDeleteVocabularyDto) {
    const existingCount = await this.prisma.vocabulary.count({
      where: { id: { in: dto.ids } },
    });

    if (existingCount !== dto.ids.length) {
      throw new NotFoundException(
        'Một hoặc nhiều từ vựng không tồn tại',
      );
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
      throw new ConflictException(
        'Từ vựng đã tồn tại trong bài học này',
      );
    }
  }

  private getLessonInclude() {
    return {
      lesson: {
        include: {
          topic: {
            include: {
              level: {
                include: {
                  language: {
                    select: {
                      id: true,
                      name: true,
                      code: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    } as const;
  }
}
