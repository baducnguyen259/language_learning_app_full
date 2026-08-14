import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CurriculumStatus,
  LessonProgressStatus,
  LessonStatus,
  UserStatus,
} from '../../generated/prisma/enums';
import { PrismaService } from '../../database/prisma.service';
import { UpdateDailyGoalDto } from './dto/update_daily_goal.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserDashboard(userId: string) {
    const profile = await this.prisma.userLearningProfile.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        dailyGoalMinutes: 15,
        timezone: 'Asia/Ho_Chi_Minh',
      },
    });

    const now = new Date();
    const oldestSessionDate = new Date(
      now.getTime() - 370 * 24 * 60 * 60 * 1000,
    );

    const [user, currentProgress, completedLessons, studySessions] =
      await Promise.all([
        this.prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, name: true, avatarUrl: true },
        }),

        this.prisma.lessonProgress.findFirst({
          where: {
            userId,
            status: LessonProgressStatus.IN_PROGRESS,
            lesson: {
              status: LessonStatus.PUBLISHED,
              chapter: { curriculum: { status: CurriculumStatus.PUBLISHED } },
            },
          },
          orderBy: { lastStudiedAt: 'desc' },
          select: {
            progressPercent: true,
            lesson: {
              select: {
                id: true,
                title: true,
                durationMinutes: true,
                thumbnailUrl: true,
                chapter: {
                  select: {
                    id: true,
                    title: true,
                    curriculum: { select: { id: true, title: true } },
                  },
                },
              },
            },
          },
        }),

        this.prisma.lessonProgress.count({
          where: {
            userId,
            status: LessonProgressStatus.COMPLETED,
            lesson: {
              status: LessonStatus.PUBLISHED,
              chapter: { curriculum: { status: CurriculumStatus.PUBLISHED } },
            },
          },
        }),

        this.prisma.studySession.findMany({
          where: {
            userId,
            endedAt: { not: null, gte: oldestSessionDate },
            durationSeconds: { gt: 0 },
          },
          select: { endedAt: true, durationSeconds: true },
        }),
      ]);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    const todayKey = this.getLocalDateKey(now, profile.timezone);
    const studiedDateKeys = new Set<string>();
    let completedSecondsToday = 0;
    for (const session of studySessions) {
      if (!session.endedAt) {
        continue;
      }
      const sessionDateKey = this.getLocalDateKey(
        session.endedAt,
        profile.timezone,
      );
      studiedDateKeys.add(sessionDateKey);
      if (sessionDateKey === todayKey) {
        completedSecondsToday += session.durationSeconds;
      }
    }

    const completedMinutesToday = Math.floor(completedSecondsToday / 60);
    const dailyGoalProgress = Math.min(
      100,
      Math.round((completedMinutesToday / profile.dailyGoalMinutes) * 100),
    );

    return {
      user,
      learningStreak: this.calculateLearningStreak(studiedDateKeys, todayKey),
      totalExperience: profile.totalExperience,
      completedLessons,
      dailyGoalMinutes: profile.dailyGoalMinutes,
      completedMinutesToday,
      dailyGoalProgress,
      currentLesson: currentProgress
        ? {
            ...currentProgress.lesson,
            progressPercent: currentProgress.progressPercent,
          }
        : null,
    };
  }

  async updateDailyGoal(userId: string, dto: UpdateDailyGoalDto) {
    const profile = await this.prisma.userLearningProfile.upsert({
      where: { userId },
      update: { dailyGoalMinutes: dto.dailyGoalMinutes },
      create: {
        userId,
        dailyGoalMinutes: dto.dailyGoalMinutes,
        timezone: 'Asia/Ho_Chi_Minh',
      },
      select: { dailyGoalMinutes: true, timezone: true },
    });
    return profile;
  }

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
        where: { status: UserStatus.ACTIVE },
      }),
      this.prisma.language.count(),
      this.prisma.level.count(),
      this.prisma.topic.count(),
      this.prisma.lesson.count(),
      this.prisma.lesson.count({
        where: { status: LessonStatus.DRAFT },
      }),

      this.prisma.lesson.count({
        where: { status: LessonStatus.SCHEDULED },
      }),

      this.prisma.lesson.count({
        where: { status: LessonStatus.PUBLISHED },
      }),

      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
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
        orderBy: { updatedAt: 'desc' },
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
                    select: { id: true, name: true, code: true },
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
  private getLocalDateKey(date: Date, timeZone: string): string {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);
    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const day = parts.find((part) => part.type === 'day')?.value;

    if (!year || !month || !day) {
      throw new Error('Không thể xác định ngày học');
    }
    return `${year}-${month}-${day}`;
  }

  private getPreviousDateKey(dateKey: string): string {
    const [year, month, day] = dateKey.split('-').map(Number);
    const previousDate = new Date(
      Date.UTC(year, month - 1, day) - 24 * 60 * 60 * 1000,
    );

    return [
      previousDate.getUTCFullYear(),
      String(previousDate.getUTCMonth() + 1).padStart(2, '0'),
      String(previousDate.getUTCDate()).padStart(2, '0'),
    ].join('-');
  }

  private calculateLearningStreak(
    studiedDateKeys: Set<string>,
    todayKey: string,
  ): number {
    let currentDateKey = studiedDateKeys.has(todayKey)
      ? todayKey
      : this.getPreviousDateKey(todayKey);
    let streak = 0;
    while (studiedDateKeys.has(currentDateKey)) {
      streak += 1;
      currentDateKey = this.getPreviousDateKey(currentDateKey);
    }
    return streak;
  }
}
