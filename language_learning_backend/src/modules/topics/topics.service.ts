import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateTopicDto } from './dto/create_topic.dto';
import { TopicQueryDto } from './dto/topic_query.dto';
import { UpdateTopicDto } from './dto/update_topic.dto';
import { ApiErrorCode } from '../../common/enums/api_error_code.enum';

@Injectable()
export class TopicsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForAdmin(query: TopicQueryDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const where: Prisma.TopicWhereInput = {
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
      ...(search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.topic.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          updatedAt: 'desc',
        },
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
          _count: {
            select: {
              lessons: true,
            },
          },
        },
      }),
      this.prisma.topic.count({
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
    const topic = await this.prisma.topic.findUnique({
      where: {
        id,
      },
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
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    if (!topic) {
      throw new NotFoundException({
        code: ApiErrorCode.TOPIC_NOT_FOUND,
        message: 'Không tìm thấy chủ đề',
      });
    }

    return topic;
  }

  async create(dto: CreateTopicDto) {
    const name = dto.name.trim();

    const level = await this.prisma.level.findUnique({
      where: {
        id: dto.levelId,
      },
      select: {
        id: true,
      },
    });

    if (!level) {
      throw new NotFoundException({
        code: ApiErrorCode.LEVEL_NOT_FOUND,
        message: 'Không tìm thấy cấp độ',
      });
    }

    const duplicatedTopic = await this.prisma.topic.findFirst({
      where: {
        levelId: dto.levelId,
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicatedTopic) {
      throw new ConflictException({
        code: ApiErrorCode.TOPIC_ALREADY_EXISTS,
        message: 'Tên chủ đề đã tồn tại trong cấp độ này',
      });
    }

    return this.prisma.topic.create({
      data: {
        name,
        levelId: dto.levelId,
      },
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
    });
  }

  async update(id: string, dto: UpdateTopicDto) {
    const currentTopic = await this.prisma.topic.findUnique({
      where: {
        id,
      },
    });

    if (!currentTopic) {
      throw new NotFoundException({
        code: ApiErrorCode.TOPIC_NOT_FOUND,
        message: 'Không tìm thấy chủ đề',
      });
    }

    const targetLevelId = dto.levelId ?? currentTopic.levelId;

    const targetName = dto.name?.trim() ?? currentTopic.name;

    if (dto.levelId !== undefined) {
      const level = await this.prisma.level.findUnique({
        where: {
          id: targetLevelId,
        },
        select: {
          id: true,
        },
      });

      if (!level) {
        throw new NotFoundException({
          code: ApiErrorCode.LEVEL_NOT_FOUND,
          message: 'Không tìm thấy cấp độ',
        });
      }
    }

    const duplicatedTopic = await this.prisma.topic.findFirst({
      where: {
        id: {
          not: id,
        },
        levelId: targetLevelId,
        name: {
          equals: targetName,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicatedTopic) {
      throw new ConflictException({
        code: ApiErrorCode.TOPIC_ALREADY_EXISTS,
        message: 'Tên chủ đề đã tồn tại trong cấp độ này',
      });
    }

    return this.prisma.topic.update({
      where: {
        id,
      },
      data: {
        name: dto.name?.trim(),
        levelId: dto.levelId,
      },
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
    });
  }

  async remove(id: string) {
    const topic = await this.prisma.topic.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    if (!topic) {
      throw new NotFoundException({
        code: ApiErrorCode.TOPIC_NOT_FOUND,
        message: 'Không tìm thấy chủ đề',
      });
    }

    if (topic._count.lessons > 0) {
      throw new ConflictException({
        code: ApiErrorCode.TOPIC_HAS_LESSONS,
        message: 'Không thể xóa chủ đề đang có bài học',
      });
    }

    return this.prisma.topic.delete({
      where: {
        id,
      },
    });
  }
}
