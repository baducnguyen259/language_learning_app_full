import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { LessonProgressStatus, Prisma } from '../../generated/prisma/client';
import { CurriculumStatus, LessonStatus } from '../../generated/prisma/enums';
import { AssignLessonDto } from './dto/assign_lesson.dto';
import { CreateChapterDto } from './dto/create_chapter.dto';
import { CreateCurriculumDto } from './dto/create_curriculum.dto';
import { CurriculumQueryDto } from './dto/curriculum_query.dto';
import { UpdateChapterDto } from './dto/update_chapter.dto';
import { UpdateCurriculumDto } from './dto/update_curriculum.dto';
import { AppCurriculumQueryDto } from './dto/app_curriculum_query.dto';
import { ApiErrorCode } from '../../common/enums/api_error_code.enum';

const curriculumInclude = {
  level: {
    select: {
      id: true,
      name: true,
      order: true,
      languageId: true,
      language: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  },
  chapters: {
    orderBy: { order: 'asc' },
    include: {
      lessons: {
        orderBy: { orderInChapter: 'asc' },
        select: {
          id: true,
          title: true,
          status: true,
          topicId: true,
          chapterId: true,
          orderInChapter: true,
          topic: { select: { id: true, name: true } },
        },
      },
    },
  },
} satisfies Prisma.CurriculumInclude;

const appCurriculumSelect = {
  id: true,
  title: true,
  description: true,
  levelId: true,
  level: {
    select: {
      id: true,
      name: true,
      order: true,
      language: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  },
  chapters: {
    where: { lessons: { some: { status: LessonStatus.PUBLISHED } } },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      order: true,
      lessons: {
        where: { status: LessonStatus.PUBLISHED },
        orderBy: { orderInChapter: 'asc' },
        select: {
          id: true,
          title: true,
          description: true,
          topicId: true,
          chapterId: true,
          orderInChapter: true,
          durationMinutes: true,
          thumbnailUrl: true,
          requiresPreviousLesson: true,
          allowReplay: true,
          topic: { select: { id: true, name: true } },
        },
      },
    },
  },
} satisfies Prisma.CurriculumSelect;

type CurriculumWithRelations = Prisma.CurriculumGetPayload<{
  include: typeof curriculumInclude;
}>;

type AppCurriculumFromDatabase = Prisma.CurriculumGetPayload<{
  select: typeof appCurriculumSelect;
}>;

type UserLessonProgress = {
  status: LessonProgressStatus;
  progressPercent: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
};

@Injectable()
export class CurriculumsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForApp(userId: string, query: AppCurriculumQueryDto) {
    const languageCode = query.languageCode?.trim().toLowerCase();
    const curriculums = await this.prisma.curriculum.findMany({
      where: {
        status: CurriculumStatus.PUBLISHED,
        ...(query.levelId ? { levelId: query.levelId } : {}),
        ...(languageCode
          ? {
              level: {
                language: {
                  code: { equals: languageCode, mode: 'insensitive' },
                },
              },
            }
          : {}),
      },
      orderBy: [{ level: { order: 'asc' } }, { title: 'asc' }],
      select: appCurriculumSelect,
    });
    return this.addUserProgress(userId, curriculums);
  }

  async findOneForApp(userId: string, id: string) {
    const curriculum = await this.prisma.curriculum.findFirst({
      where: { id, status: CurriculumStatus.PUBLISHED },
      select: appCurriculumSelect,
    });
    if (!curriculum) {
      throw new NotFoundException({
        code: ApiErrorCode.CURRICULUM_NOT_FOUND,
        message: 'Không tìm thấy lộ trình đang được xuất bản',
      });
    }
    const [curriculumWithProgress] = await this.addUserProgress(userId, [
      curriculum,
    ]);
    return curriculumWithProgress;
  }

  async findAllForAdmin(query: CurriculumQueryDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const search = query.search?.trim();
    const where: Prisma.CurriculumWhereInput = {
      ...(query.levelId ? { levelId: query.levelId } : {}),
      ...(query.languageId ? { level: { languageId: query.languageId } } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [curriculums, total] = await this.prisma.$transaction([
      this.prisma.curriculum.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: curriculumInclude,
      }),
      this.prisma.curriculum.count({ where }),
    ]);

    return {
      items: curriculums.map((curriculum) => this.toResponse(curriculum)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneForAdmin(id: string) {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id },
      include: curriculumInclude,
    });

    if (!curriculum) {
      throw new NotFoundException({
        code: ApiErrorCode.CURRICULUM_NOT_FOUND,
        message: 'Không tìm thấy lộ trình',
      });
    }
    return this.toResponse(curriculum);
  }
  async create(dto: CreateCurriculumDto) {
    await this.ensureLevelExists(dto.levelId);
    const title = dto.title.trim();
    await this.ensureCurriculumTitleIsUnique(dto.levelId, title);

    const curriculum = await this.prisma.curriculum.create({
      data: {
        title,
        description: dto.description?.trim() || null,
        status: dto.status ?? CurriculumStatus.DRAFT,
        levelId: dto.levelId,
      },
      include: curriculumInclude,
    });
    return this.toResponse(curriculum);
  }
  async update(id: string, dto: UpdateCurriculumDto) {
    const currentCurriculum = await this.prisma.curriculum.findUnique({
      where: { id },
    });

    if (!currentCurriculum) {
      throw new NotFoundException({
        code: ApiErrorCode.CURRICULUM_NOT_FOUND,
        message: 'Không tìm thấy lộ trình',
      });
    }

    const targetLevelId = dto.levelId ?? currentCurriculum.levelId;
    const targetTitle = dto.title?.trim() ?? currentCurriculum.title;

    if (dto.levelId !== undefined) {
      await this.ensureLevelExists(targetLevelId);
    }

    await this.ensureCurriculumTitleIsUnique(targetLevelId, targetTitle, id);

    const curriculum = await this.prisma.curriculum.update({
      where: { id },
      data: {
        title: dto.title?.trim(),
        description:
          dto.description !== undefined
            ? dto.description.trim() || null
            : undefined,
        status: dto.status,
        levelId: dto.levelId,
      },
      include: curriculumInclude,
    });

    return this.toResponse(curriculum);
  }
  async remove(id: string) {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id },
      include: { _count: { select: { chapters: true } } },
    });

    if (!curriculum) {
      throw new NotFoundException({
        code: ApiErrorCode.CURRICULUM_NOT_FOUND,
        message: 'Không tìm thấy lộ trình',
      });
    }
    if (curriculum._count.chapters > 0) {
      throw new ConflictException({
        code: ApiErrorCode.CURRICULUM_HAS_CHAPTERS,
        message:
          'Không thể xóa lộ trình đang có chương. Hãy xóa các chương trước',
      });
    }
    return this.prisma.curriculum.delete({ where: { id } });
  }

  async createChapter(curriculumId: string, dto: CreateChapterDto) {
    await this.ensureCurriculumExists(curriculumId);
    const title = dto.title.trim();
    await this.ensureChapterIsUnique(curriculumId, title, dto.order);
    return this.prisma.chapter.create({
      data: {
        title,
        description: dto.description?.trim() || null,
        order: dto.order,
        curriculumId,
      },
      include: { lessons: true },
    });
  }

  async updateChapter(
    curriculumId: string,
    chapterId: string,
    dto: UpdateChapterDto,
  ) {
    const chapter = await this.findChapterInCurriculum(curriculumId, chapterId);

    const targetTitle = dto.title?.trim() ?? chapter.title;
    const targetOrder = dto.order ?? chapter.order;
    await this.ensureChapterIsUnique(
      curriculumId,
      targetTitle,
      targetOrder,
      chapterId,
    );

    return this.prisma.chapter.update({
      where: { id: chapterId },
      data: {
        title: dto.title?.trim(),
        description:
          dto.description !== undefined
            ? dto.description.trim() || null
            : undefined,
        order: dto.order,
      },
      include: { lessons: { orderBy: { orderInChapter: 'asc' } } },
    });
  }

  async removeChapter(curriculumId: string, chapterId: string) {
    await this.findChapterInCurriculum(curriculumId, chapterId);

    const [, deletedChapter] = await this.prisma.$transaction([
      this.prisma.lesson.updateMany({
        where: { chapterId },
        data: { chapterId: null, orderInChapter: null },
      }),
      this.prisma.chapter.delete({ where: { id: chapterId } }),
    ]);

    return deletedChapter;
  }

  async assignLesson(
    curriculumId: string,
    chapterId: string,
    dto: AssignLessonDto,
  ) {
    const curriculum = await this.ensureCurriculumExists(curriculumId);
    await this.findChapterInCurriculum(curriculumId, chapterId);

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: dto.lessonId },
      include: { topic: { select: { levelId: true } } },
    });

    if (!lesson) {
      throw new NotFoundException({
        code: ApiErrorCode.LESSON_NOT_FOUND,
        message: 'Không tìm thấy bài học',
      });
    }
    if (lesson.topic.levelId !== curriculum.levelId) {
      throw new ConflictException({
        code: ApiErrorCode.CURRICULUM_LEVEL_MISMATCH,
        message: 'Bài học và lộ trình phải thuộc cùng một cấp độ',
      });
    }
    const occupiedOrder = await this.prisma.lesson.findFirst({
      where: {
        id: { not: dto.lessonId },
        chapterId,
        orderInChapter: dto.orderInChapter,
      },
      select: { id: true },
    });
    if (occupiedOrder) {
      throw new ConflictException({
        code: ApiErrorCode.CHAPTER_LESSON_ORDER_ALREADY_EXISTS,
        message: 'Thứ tự bài học đã tồn tại trong chương',
      });
    }
    return this.prisma.lesson.update({
      where: { id: dto.lessonId },
      data: { chapterId, orderInChapter: dto.orderInChapter },
      include: { topic: { select: { id: true, name: true } } },
    });
  }

  async removeLesson(
    curriculumId: string,
    chapterId: string,
    lessonId: string,
  ) {
    await this.findChapterInCurriculum(curriculumId, chapterId);

    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, chapterId },
      select: { id: true },
    });
    if (!lesson) {
      throw new NotFoundException({
        code: ApiErrorCode.LESSON_NOT_IN_CHAPTER,
        message: 'Bài học không thuộc chương này',
      });
    }
    return this.prisma.lesson.update({
      where: { id: lessonId },
      data: { chapterId: null, orderInChapter: null },
      include: { topic: { select: { id: true, name: true } } },
    });
  }

  private async ensureLevelExists(levelId: string) {
    const level = await this.prisma.level.findUnique({
      where: { id: levelId },
      select: { id: true },
    });
    if (!level) {
      throw new NotFoundException({
        code: ApiErrorCode.LEVEL_NOT_FOUND,
        message: 'Không tìm thấy cấp độ',
      });
    }
    return level;
  }

  private async ensureCurriculumExists(id: string) {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id },
      select: { id: true, levelId: true },
    });

    if (!curriculum) {
      throw new NotFoundException({
        code: ApiErrorCode.CURRICULUM_NOT_FOUND,
        message: 'Không tìm thấy lộ trình',
      });
    }
    return curriculum;
  }

  private async findChapterInCurriculum(
    curriculumId: string,
    chapterId: string,
  ) {
    const chapter = await this.prisma.chapter.findFirst({
      where: { id: chapterId, curriculumId },
    });
    if (!chapter) {
      throw new NotFoundException({
        code: ApiErrorCode.CHAPTER_NOT_FOUND,
        message: 'Không tìm thấy chương trong lộ trình',
      });
    }
    return chapter;
  }

  private async ensureCurriculumTitleIsUnique(
    levelId: string,
    title: string,
    excludedId?: string,
  ) {
    const duplicatedCurriculum = await this.prisma.curriculum.findFirst({
      where: {
        ...(excludedId ? { id: { not: excludedId } } : {}),
        levelId,
        title: { equals: title, mode: 'insensitive' },
      },
      select: { id: true },
    });
    if (duplicatedCurriculum) {
      throw new ConflictException({
        code: ApiErrorCode.CURRICULUM_ALREADY_EXISTS,
        message: 'Tên lộ trình đã tồn tại trong cấp độ này',
      });
    }
  }

  private async ensureChapterIsUnique(
    curriculumId: string,
    title: string,
    order: number,
    excludedId?: string,
  ) {
    const duplicatedChapter = await this.prisma.chapter.findFirst({
      where: {
        ...(excludedId ? { id: { not: excludedId } } : {}),
        curriculumId,
        OR: [{ title: { equals: title, mode: 'insensitive' } }, { order }],
      },
      select: { id: true, title: true, order: true },
    });
    if (!duplicatedChapter) return;
    if (duplicatedChapter.order === order) {
      throw new ConflictException({
        code: ApiErrorCode.CHAPTER_ORDER_ALREADY_EXISTS,
        message: 'Thứ tự chương đã tồn tại trong lộ trình',
      });
    }
    throw new ConflictException({
      code: ApiErrorCode.CHAPTER_TITLE_ALREADY_EXISTS,
      message: 'Tên chương đã tồn tại trong lộ trình',
    });
  }
  private async addUserProgress(
    userId: string,
    curriculums: AppCurriculumFromDatabase[],
  ) {
    const lessonIds = curriculums.flatMap((curriculum) =>
      curriculum.chapters.flatMap((chapter) =>
        chapter.lessons.map((lesson) => lesson.id),
      ),
    );

    const progressRecords = await this.prisma.lessonProgress.findMany({
      where: { userId, lessonId: { in: lessonIds } },
      select: {
        lessonId: true,
        status: true,
        progressPercent: true,
        totalQuestions: true,
        answeredQuestions: true,
        correctAnswers: true,
      },
    });

    const progressByLessonId = new Map<string, UserLessonProgress>(
      progressRecords.map((record) => [
        record.lessonId,
        {
          status: record.status,
          progressPercent: record.progressPercent,
          totalQuestions: record.totalQuestions,
          answeredQuestions: record.answeredQuestions,
          correctAnswers: record.correctAnswers,
        },
      ]),
    );

    return curriculums.map((curriculum) =>
      this.toAppResponse(curriculum, progressByLessonId),
    );
  }

  private toAppResponse(
    curriculum: AppCurriculumFromDatabase,
    progressByLessonId: Map<string, UserLessonProgress>,
  ) {
    const orderedLessons = curriculum.chapters.flatMap(
      (chapter) => chapter.lessons,
    );
    const lessonStates = new Map<
      string,
      {
        progress: UserLessonProgress | null;
        isCompleted: boolean;
        isLocked: boolean;
      }
    >();

    orderedLessons.forEach((lesson, index) => {
      const progress = progressByLessonId.get(lesson.id) ?? null;
      const isCompleted = progress?.status === LessonProgressStatus.COMPLETED;
      const previousLesson = orderedLessons[index - 1];
      const previousLessonCompleted = previousLesson
        ? lessonStates.get(previousLesson.id)?.isCompleted === true
        : true;

      const isLocked =
        !isCompleted &&
        lesson.requiresPreviousLesson &&
        !previousLessonCompleted;

      lessonStates.set(lesson.id, {
        progress,
        isCompleted,
        isLocked,
      });
    });

    const chapters = curriculum.chapters.map((chapter) => {
      const lessons = chapter.lessons.map((lesson) => {
        const state = lessonStates.get(lesson.id);
        return {
          ...lesson,
          progress: state?.progress ?? null,
          isCompleted: state?.isCompleted ?? false,
          isLocked: state?.isLocked ?? false,
        };
      });
      const totalLessons = lessons.length;
      const completedLessons = lessons.filter(
        (lesson) => lesson.isCompleted,
      ).length;
      return {
        ...chapter,
        lessons,
        totalLessons,
        completedLessons,
        progressPercent:
          totalLessons === 0
            ? 0
            : Math.round((completedLessons / totalLessons) * 100),
      };
    });

    const allLessons = chapters.flatMap((chapter) => chapter.lessons);
    const totalLessons = allLessons.length;
    const completedLessons = allLessons.filter(
      (lesson) => lesson.isCompleted,
    ).length;
    return {
      ...curriculum,
      chapters,
      totalLessons,
      completedLessons,
      progressPercent:
        totalLessons === 0
          ? 0
          : Math.round((completedLessons / totalLessons) * 100),
    };
  }

  private toResponse(curriculum: CurriculumWithRelations) {
    const lessons = curriculum.chapters.flatMap((chapter) => chapter.lessons);
    const lessonCount = lessons.length;
    const publishedLessonCount = lessons.filter(
      (lesson) => lesson.status === LessonStatus.PUBLISHED,
    ).length;
    return {
      ...curriculum,
      chapterCount: curriculum.chapters.length,
      lessonCount,
      completionPercentage:
        lessonCount === 0
          ? 0
          : Math.round((publishedLessonCount / lessonCount) * 100),
    };
  }
}
