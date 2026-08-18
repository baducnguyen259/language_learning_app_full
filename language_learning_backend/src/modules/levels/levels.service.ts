import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { LevelQueryDto } from './dto/level_query.dto';
import { Prisma } from '../../generated/prisma/client';
import { CreateLevelDto } from './dto/create_level.dto';
import { UpdateLevelDto } from './dto/update_level.dto';
import { ApiErrorCode } from '../../common/enums/api_error_code.enum';

@Injectable()
export class LevelsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAllForAdmin(query: LevelQueryDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const where: Prisma.LevelWhereInput = {
      ...(query.languageId
        ? {
            languageId: query.languageId,
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
      this.prisma.level.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          {
            languageId: 'asc',
          },
          {
            order: 'asc',
          },
        ],
        include: {
          language: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          _count: {
            select: {
              topics: true,
            },
          },
        },
      }),
      this.prisma.level.count({
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
    const level = await this.prisma.level.findUnique({
      where: {
        id,
      },
      include: {
        language: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        _count: {
          select: {
            topics: true,
          },
        },
      },
    });
    if (!level) {
      throw new NotFoundException({
        code: ApiErrorCode.LEVEL_NOT_FOUND,
        message: 'Không tìm thấy cấp độ',
      });
    }
    return level;
  }
  async create(dto: CreateLevelDto) {
    const name = dto.name.trim();
    const language = await this.prisma.language.findUnique({
      where: {
        id: dto.languageId,
      },
      select: {
        id: true,
      },
    });
    if (!language) {
      throw new NotFoundException({
        code: ApiErrorCode.LANGUAGE_NOT_FOUND,
        message: 'Không tìm thấy ngôn ngữ',
      });
    }
    const duplicatedOrder = await this.prisma.level.findUnique({
      where: {
        languageId_order: {
          languageId: dto.languageId,
          order: dto.order,
        },
      },
    });
    if (duplicatedOrder) {
      throw new ConflictException({
        code: ApiErrorCode.LEVEL_ORDER_ALREADY_EXISTS,
        message: 'Thứ tự cấp độ đã tồn tại trong ngôn ngữ này',
      });
    }
    return this.prisma.level.create({
      data: {
        name,
        order: dto.order,
        languageId: dto.languageId,
      },
      include: {
        language: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }
  async update(id: string, dto: UpdateLevelDto) {
    const currentLevel = await this.prisma.level.findUnique({
      where: {
        id,
      },
    });
    if (!currentLevel) {
      throw new NotFoundException({
        code: ApiErrorCode.LEVEL_NOT_FOUND,
        message: 'Không tìm thấy cấp độ',
      });
    }
    const targetLanguageId = dto.languageId ?? currentLevel.languageId;
    const targetOrder = dto.order ?? currentLevel.order;
    if (dto.languageId !== undefined) {
      const language = await this.prisma.language.findUnique({
        where: {
          id: targetLanguageId,
        },
        select: {
          id: true,
        },
      });
      if (!language) {
        throw new NotFoundException({
          code: ApiErrorCode.LANGUAGE_NOT_FOUND,
          message: 'Không tìm thấy ngôn ngữ',
        });
      }
    }
    const duplicatedOrder = await this.prisma.level.findFirst({
      where: {
        id: {
          not: id,
        },
        languageId: targetLanguageId,
        order: targetOrder,
      },
      select: {
        id: true,
      },
    });
    if (duplicatedOrder) {
      throw new ConflictException({
        code: ApiErrorCode.LEVEL_ORDER_ALREADY_EXISTS,
        message: 'Thứ tự cấp độ đã tồn tại trong ngôn ngữ này',
      });
    }
    return this.prisma.level.update({
      where: {
        id,
      },
      data: {
        name: dto.name?.trim(),
        order: dto.order,
        languageId: dto.languageId,
      },
      include: {
        language: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }
  async remove(id: string) {
    const level = await this.prisma.level.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            topics: true,
          },
        },
      },
    });

    if (!level) {
      throw new NotFoundException({
        code: ApiErrorCode.LEVEL_NOT_FOUND,
        message: 'Không tìm thấy cấp độ',
      });
    }

    if (level._count.topics > 0) {
      throw new ConflictException({
        code: ApiErrorCode.LEVEL_HAS_TOPICS,
        message: 'Không thể xóa cấp độ đang có chủ đề',
      });
    }

    return this.prisma.level.delete({
      where: {
        id,
      },
    });
  }
}
