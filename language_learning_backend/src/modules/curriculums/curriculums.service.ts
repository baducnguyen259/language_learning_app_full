import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type { Prisma } from '../../generated/prisma/client';
import { CurriculumStatus, LessonStatus } from '../../generated/prisma/enums';
import { AssignLessonDto } from './dto/assign_lesson.dto';
import { CreateChapterDto } from './dto/create_chapter.dto';
import { CreateCurriculumDto } from './dto/create_curriculum.dto';
import { CurriculumQueryDto } from './dto/curriculum_query.dto';
import { UpdateChapterDto } from './dto/update_chapter.dto';
import { UpdateCurriculumDto } from './dto/update_curriculum.dto';

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
          topic: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.CurriculumInclude;

type CurriculumWithRelations = Prisma.CurriculumGetPayload<{
  include: typeof curriculumInclude;
}>;

@Injectable()
export class CurriculumsService {
  constructor(private readonly prisma: PrismaService) {}

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
      throw new NotFoundException('Không tìm thấy lộ trình');
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
      throw new NotFoundException('Không tìm thấy lộ trình');
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
      include: {
        _count: {
          select: { chapters: true },
        },
      },
    });

    if (!curriculum) {
      throw new NotFoundException('Không tìm thấy lộ trình');
    }

    if (curriculum._count.chapters > 0) {
      throw new ConflictException(
        'Không thể xóa lộ trình đang có chương. Hãy xóa các chương trước',
      );
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
      include: {
        lessons: {
          orderBy: { orderInChapter: 'asc' },
        },
      },
    });
  }

  async removeChapter(curriculumId: string, chapterId: string) {
    await this.findChapterInCurriculum(curriculumId, chapterId);

    const [, deletedChapter] = await this.prisma.$transaction([
      this.prisma.lesson.updateMany({
        where: { chapterId },
        data: {
          chapterId: null,
          orderInChapter: null,
        },
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
      include: {
        topic: {
          select: { levelId: true },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài học');
    }

    if (lesson.topic.levelId !== curriculum.levelId) {
      throw new ConflictException(
        'Bài học và lộ trình phải thuộc cùng một cấp độ',
      );
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
      throw new ConflictException('Thứ tự bài học đã tồn tại trong chương');
    }

    return this.prisma.lesson.update({
      where: { id: dto.lessonId },
      data: {
        chapterId,
        orderInChapter: dto.orderInChapter,
      },
      include: {
        topic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async removeLesson(
    curriculumId: string,
    chapterId: string,
    lessonId: string,
  ) {
    await this.findChapterInCurriculum(curriculumId, chapterId);

    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id: lessonId,
        chapterId,
      },
      select: { id: true },
    });

    if (!lesson) {
      throw new NotFoundException('Bài học không thuộc chương này');
    }

    return this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        chapterId: null,
        orderInChapter: null,
      },
      include: {
        topic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  private async ensureLevelExists(levelId: string) {
    const level = await this.prisma.level.findUnique({
      where: { id: levelId },
      select: { id: true },
    });

    if (!level) {
      throw new NotFoundException('Không tìm thấy cấp độ');
    }

    return level;
  }

  private async ensureCurriculumExists(id: string) {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id },
      select: {
        id: true,
        levelId: true,
      },
    });

    if (!curriculum) {
      throw new NotFoundException('Không tìm thấy lộ trình');
    }

    return curriculum;
  }

  private async findChapterInCurriculum(
    curriculumId: string,
    chapterId: string,
  ) {
    const chapter = await this.prisma.chapter.findFirst({
      where: {
        id: chapterId,
        curriculumId,
      },
    });

    if (!chapter) {
      throw new NotFoundException('Không tìm thấy chương trong lộ trình');
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
        title: {
          equals: title,
          mode: 'insensitive',
        },
      },
      select: { id: true },
    });

    if (duplicatedCurriculum) {
      throw new ConflictException('Tên lộ trình đã tồn tại trong cấp độ này');
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
        OR: [
          {
            title: {
              equals: title,
              mode: 'insensitive',
            },
          },
          { order },
        ],
      },
      select: {
        id: true,
        title: true,
        order: true,
      },
    });

    if (!duplicatedChapter) {
      return;
    }

    if (duplicatedChapter.order === order) {
      throw new ConflictException('Thứ tự chương đã tồn tại trong lộ trình');
    }

    throw new ConflictException('Tên chương đã tồn tại trong lộ trình');
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
