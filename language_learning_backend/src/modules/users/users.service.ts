import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client';
import { UserStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../database/prisma.service';
import { UpdateUserDto } from './dto/update_user.dto';
import { UpdateUserStatusDto } from './dto/update_user_status.dto';
import { UserQueryDto } from './dto/user_query.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForAdmin(query: UserQueryDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const where: Prisma.UserWhereInput = {
      ...(query.role
        ? {
            role: query.role,
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
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({
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
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto, currentAdminId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    if (id === currentAdminId && dto.role !== undefined) {
      throw new BadRequestException(
        'Không thể tự thay đổi quyền của chính mình',
      );
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: dto.name?.trim(),
        role: dto.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateStatus(
    id: string,
    dto: UpdateUserStatusDto,
    currentAdminId: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    if (id === currentAdminId && dto.status === UserStatus.LOCKED) {
      throw new BadRequestException(
        'Không thể tự khóa tài khoản của chính mình',
      );
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        status: dto.status,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
