import { Injectable } from '@nestjs/common';
import { LessonStatus, UserStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminOverview() {
    const [
      totalUsers,
      activeAccounts,
      totalLanguages,
      totalLevels,
      totalTopics,
      totalLessons,
      draftLessons,
      scheduledLessons,
      publishedLessons,
      recentUsers,
      recentLessons,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: {
          status: UserStatus.ACTIVE,
        },
      }),
      this.prisma.language.count(),
      this.prisma.level.count(),
      this.prisma.topic.count(),
      this.prisma.lesson.count(),
      this.prisma.lesson.count({
        where: {
          status: LessonStatus.DRAFT,
        },
      }),

      this.prisma.lesson.count({
        where: {
          status: LessonStatus.SCHEDULED,
        },
      }),

      this.prisma.lesson.count({
        where: {
          status: LessonStatus.PUBLISHED,
        },
      }),

      this.prisma.user.findMany({
        take: 5,
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
        },
      }),

      this.prisma.lesson.findMany({
        take: 5,
        orderBy: {
          updatedAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
          topic: {
            select: {
              id: true,
              name: true,
              level: {
                select: {
                  id: true,
                  name: true,
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
    ]);

    return {
      overview: {
        totalUsers,
        activeAccounts,
        totalLanguages,
        totalLevels,
        totalTopics,
        totalLessons,
      },
      lessonStatus: {
        draft: draftLessons,
        scheduled: scheduledLessons,
        published: publishedLessons,
      },
      recentUsers,
      recentLessons,
    };
  }
}
