import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client';
import {
  CurriculumStatus,
  LessonStatus,
  UserStatus,
} from '../../generated/prisma/enums';
import { PrismaService } from '../../database/prisma.service';
import { UpdateUserDto } from './dto/update_user.dto';
import { UpdateUserStatusDto } from './dto/update_user_status.dto';
import { UserQueryDto } from './dto/user_query.dto';
import { UpdateMyProfileDto } from './dto/update_my_profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    const [user, latestProgress] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          createdAt: true,
          learningProfile: {
            select: {
              dailyGoalMinutes: true,
              totalExperience: true,
              timezone: true,
            },
          },
        },
      }),

      this.prisma.lessonProgress.findFirst({
        where: {
          userId,
          lesson: {
            status: LessonStatus.PUBLISHED,
            chapter: { curriculum: { status: CurriculumStatus.PUBLISHED } },
          },
        },
        orderBy: { lastStudiedAt: 'desc' },
        select: {
          lesson: {
            select: {
              topic: {
                select: {
                  level: {
                    select: {
                      id: true,
                      name: true,
                      order: true,
                      language: {
                        select: { id: true, name: true, code: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const currentLevel = latestProgress?.lesson.topic.level ?? null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      dailyGoalMinutes: user.learningProfile?.dailyGoalMinutes ?? 15,
      totalExperience: user.learningProfile?.totalExperience ?? 0,
      timezone: user.learningProfile?.timezone ?? 'Asia/Ho_Chi_Minh',
      currentLanguage: currentLevel?.language ?? null,

      currentLevel: currentLevel
        ? {
            id: currentLevel.id,
            name: currentLevel.name,
            order: currentLevel.order,
          }
        : null,
      createdAt: user.createdAt,
    };
  }

  async updateMyProfile(userId: string, dto: UpdateMyProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { name: dto.name },
    });

    return this.getMyProfile(userId);
  }

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
