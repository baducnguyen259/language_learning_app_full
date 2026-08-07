import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client';
import { LessonStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../database/prisma.service';
import { CreateLessonDto } from './dto/create_lesson.dto';
import { LessonQueryDto } from './dto/lesson_query.dto';
import { UpdateLessonDto } from './dto/update_lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForAdmin(query: LessonQueryDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const topicWhere: Prisma.TopicWhereInput = {
      ...(query.levelId
        ? {
            levelId: query.levelId,
          }
        : {}),
      ...(query.languageId
        ? {
            level: {
              languageId: query.languageId,
            },
          }
        : {}),
    };

    const hasTopicFilter =
      query.levelId !== undefined || query.languageId !== undefined;

    const where: Prisma.LessonWhereInput = {
      ...(query.topicId
        ? {
            topicId: query.topicId,
          }
        : {}),
      ...(hasTopicFilter
        ? {
            topic: topicWhere,
          }
        : {}),
      ...(query.status
        ? {
            status: query.status,
          }
        : {}),
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.lesson.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          updatedAt: 'desc',
        },
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
      }),
      this.prisma.lesson.count({
        where,
      }),
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
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id,
      },
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
    });

    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài học');
    }

    return lesson;
  }

  async create(dto: CreateLessonDto) {
    const topic = await this.prisma.topic.findUnique({
      where: {
        id: dto.topicId,
      },
      select: {
        id: true,
      },
    });

    if (!topic) {
      throw new NotFoundException('Không tìm thấy chủ đề');
    }

    const status = dto.status ?? LessonStatus.DRAFT;

    if (status === LessonStatus.SCHEDULED && !dto.scheduledAt) {
      throw new BadRequestException('Bài học hẹn giờ phải có scheduledAt');
    }

    if (status !== LessonStatus.SCHEDULED && dto.scheduledAt) {
      throw new BadRequestException(
        'scheduledAt chỉ được sử dụng khi trạng thái là SCHEDULED',
      );
    }

    const publishedAt = status === LessonStatus.PUBLISHED ? new Date() : null;

    return this.prisma.lesson.create({
      data: {
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        topicId: dto.topicId,
        status,
        durationMinutes: dto.durationMinutes,
        thumbnailUrl: dto.thumbnailUrl?.trim() || null,
        requiresPreviousLesson: dto.requiresPreviousLesson ?? false,
        allowReplay: dto.allowReplay ?? true,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        publishedAt,
      },
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
    });
  }

  async update(id: string, dto: UpdateLessonDto) {
    const currentLesson = await this.prisma.lesson.findUnique({
      where: {
        id,
      },
    });

    if (!currentLesson) {
      throw new NotFoundException('Không tìm thấy bài học');
    }

    if (dto.topicId !== undefined) {
      const topic = await this.prisma.topic.findUnique({
        where: {
          id: dto.topicId,
        },
        select: {
          id: true,
        },
      });

      if (!topic) {
        throw new NotFoundException('Không tìm thấy chủ đề');
      }
    }

    const targetStatus = dto.status ?? currentLesson.status;

    let scheduledAt = currentLesson.scheduledAt;
    let publishedAt = currentLesson.publishedAt;

    if (dto.scheduledAt !== undefined) {
      if (targetStatus !== LessonStatus.SCHEDULED) {
        throw new BadRequestException(
          'scheduledAt chỉ được sử dụng khi trạng thái là SCHEDULED',
        );
      }

      scheduledAt = new Date(dto.scheduledAt);
    }

    if (targetStatus === LessonStatus.SCHEDULED && !scheduledAt) {
      throw new BadRequestException('Bài học hẹn giờ phải có scheduledAt');
    }

    if (dto.status !== undefined && targetStatus !== LessonStatus.SCHEDULED) {
      scheduledAt = null;
    }

    if (
      dto.status === LessonStatus.PUBLISHED &&
      currentLesson.status !== LessonStatus.PUBLISHED
    ) {
      publishedAt = new Date();
    }

    if (dto.status !== undefined && dto.status !== LessonStatus.PUBLISHED) {
      publishedAt = null;
    }

    return this.prisma.lesson.update({
      where: {
        id,
      },
      data: {
        title: dto.title?.trim(),
        description:
          dto.description !== undefined
            ? dto.description.trim() || null
            : undefined,
        topicId: dto.topicId,
        status: dto.status,
        durationMinutes: dto.durationMinutes,
        thumbnailUrl:
          dto.thumbnailUrl !== undefined
            ? dto.thumbnailUrl.trim() || null
            : undefined,
        requiresPreviousLesson: dto.requiresPreviousLesson,
        allowReplay: dto.allowReplay,
        scheduledAt,
        publishedAt,
      },
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
    });
  }

  async remove(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài học');
    }

    return this.prisma.lesson.delete({
      where: {
        id,
      },
    });
  }
}
