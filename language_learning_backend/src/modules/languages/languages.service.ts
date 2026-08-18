import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { LanguageQueryDto } from './dto/language_query.dto';
import { Prisma } from '../../generated/prisma/client';
import { UpdateLanguageDto } from './dto/update_language.dto';
import { CreateLanguageDto } from './dto/create_language.dto';
import { ApiErrorCode } from '../../common/enums/api_error_code.enum';

@Injectable()
export class LanguagesService {
  constructor(private readonly prisma: PrismaService) {}
  async findAllForAdmin(query: LanguageQueryDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const search = query.search?.trim();
    const where: Prisma.LanguageWhereInput = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              code: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.language.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          _count: {
            select: {
              levels: true,
            },
          },
        },
      }),
      this.prisma.language.count({
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
    const language = await this.prisma.language.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            levels: true,
          },
        },
      },
    });
    if (!language) {
      throw new NotFoundException({
        code: ApiErrorCode.LANGUAGE_NOT_FOUND,
        message: 'Không tìm thấy ngôn ngữ',
      });
    }
    return language;
  }
  async create(dto: CreateLanguageDto) {
    const name = dto.name.trim();
    const code = dto.code.trim().toLowerCase();
    const existingLanguage = await this.prisma.language.findFirst({
      where: {
        OR: [
          {
            name: {
              equals: name,
              mode: 'insensitive',
            },
          },
          {
            code: {
              equals: code,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    if (existingLanguage) {
      throw new ConflictException({
        code: ApiErrorCode.LANGUAGE_ALREADY_EXISTS,
        message: 'Tên hoặc mã ngôn ngữ đã tồn tại',
      });
    }
    return this.prisma.language.create({
      data: {
        name,
        code,
      },
    });
  }

  async update(id: string, dto: UpdateLanguageDto) {
    await this.findOneForAdmin(id);
    const name = dto.name?.trim();
    const code = dto.code?.trim().toLowerCase();
    const duplicateConditions: Prisma.LanguageWhereInput[] = [];

    if (name !== undefined) {
      duplicateConditions.push({
        name: {
          equals: name,
          mode: 'insensitive',
        },
      });
    }
    if (code !== undefined) {
      duplicateConditions.push({
        code: {
          equals: code,
          mode: 'insensitive',
        },
      });
    }
    if (duplicateConditions.length > 0) {
      const existingLanguage = await this.prisma.language.findFirst({
        where: {
          id: {
            not: id,
          },
          OR: duplicateConditions,
        },
      });

      if (existingLanguage) {
        throw new ConflictException({
          code: ApiErrorCode.LANGUAGE_ALREADY_EXISTS,
          message: 'Tên hoặc mã ngôn ngữ đã tồn tại',
        });
      }
    }
    return this.prisma.language.update({
      where: {
        id,
      },
      data: {
        name,
        code,
      },
    });
  }

  async remove(id: string) {
    const language = await this.prisma.language.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            levels: true,
          },
        },
      },
    });

    if (!language) {
      throw new NotFoundException({
        code: ApiErrorCode.LANGUAGE_NOT_FOUND,
        message: 'Không tìm thấy ngôn ngữ',
      });
    }
    if (language._count.levels > 0) {
      throw new ConflictException({
        code: ApiErrorCode.LANGUAGE_HAS_LEVELS,
        message: 'Không thể xóa ngôn ngữ đang có cấp độ',
      });
    }
    return this.prisma.language.delete({
      where: {
        id,
      },
    });
  }
}
