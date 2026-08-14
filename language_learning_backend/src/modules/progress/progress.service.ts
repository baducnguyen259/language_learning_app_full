import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type { Prisma } from '../../generated/prisma/client';
import {
  CurriculumStatus,
  LessonProgressStatus,
  LessonStatus,
  QuizStatus,
} from '../../generated/prisma/enums';
import { ProgressQueryDto } from './dto/progress_query.dto';

const progressInclude = {
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
          order: true,
          curriculumId: true,
        },
      },
    },
  },
} satisfies Prisma.LessonProgressInclude;

type ProgressWithLesson = Prisma.LessonProgressGetPayload<{
  include: typeof progressInclude;
}>;

type RecordQuizAnswerInput = {
  userId: string;
  lessonId: string;
  questionId: string;
  userAnswer: string[];
  isCorrect: boolean;
};

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async startLesson(userId: string, lessonId: string) {
    const lesson = await this.findAvailableLesson(lessonId);
    const now = new Date();

    const progress = await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        totalQuestions: lesson.totalQuestions,
        lastStudiedAt: now,
      },
      update: { totalQuestions: lesson.totalQuestions, lastStudiedAt: now },
      include: progressInclude,
    });

    return this.toResponse(progress);
  }

  async findAll(userId: string, query: ProgressQueryDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    const where: Prisma.LessonProgressWhereInput = {
      userId,
      ...(query.status ? { status: query.status } : {}),
      lesson: {
        status: LessonStatus.PUBLISHED,
        chapter: { curriculum: { status: CurriculumStatus.PUBLISHED } },
      },
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.lessonProgress.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastStudiedAt: 'desc' },
        include: progressInclude,
      }),
      this.prisma.lessonProgress.count({ where }),
    ]);

    return {
      items: items.map((progress) => this.toResponse(progress)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, lessonId: string) {
    const progress = await this.prisma.lessonProgress.findFirst({
      where: {
        userId,
        lessonId,
        lesson: {
          status: LessonStatus.PUBLISHED,
          chapter: { curriculum: { status: CurriculumStatus.PUBLISHED } },
        },
      },
      include: progressInclude,
    });
    if (!progress) {
      throw new NotFoundException('Người học chưa bắt đầu bài học này');
    }
    return this.toResponse(progress);
  }
  async completeLesson(userId: string, lessonId: string) {
    const lesson = await this.findAvailableLesson(lessonId);
    let answeredQuestions = 0;
    let correctAnswers = 0;

    if (lesson.totalQuestions > 0) {
      [answeredQuestions, correctAnswers] = await this.prisma.$transaction([
        this.prisma.userQuestionProgress.count({
          where: {
            userId,
            question: { quiz: { lessonId, status: QuizStatus.ACTIVE } },
          },
        }),
        this.prisma.userQuestionProgress.count({
          where: {
            userId,
            isCorrect: true,
            question: { quiz: { lessonId, status: QuizStatus.ACTIVE } },
          },
        }),
      ]);

      if (answeredQuestions < lesson.totalQuestions) {
        throw new BadRequestException(
          `Bạn mới hoàn thành ${answeredQuestions}/${lesson.totalQuestions} câu hỏi`,
        );
      }
    }
    const currentProgress = await this.prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
      select: { completedAt: true },
    });
    const now = new Date();
    const completedAt = currentProgress?.completedAt ?? now;

    const progress = await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        status: LessonProgressStatus.COMPLETED,
        progressPercent: 100,
        totalQuestions: lesson.totalQuestions,
        answeredQuestions,
        correctAnswers,
        completedAt,
        lastStudiedAt: now,
      },
      update: {
        status: LessonProgressStatus.COMPLETED,
        progressPercent: 100,
        totalQuestions: lesson.totalQuestions,
        answeredQuestions,
        correctAnswers,
        completedAt,
        lastStudiedAt: now,
      },
      include: progressInclude,
    });

    return this.toResponse(progress);
  }

  async recordQuizAnswer(input: RecordQuizAnswerInput): Promise<void> {
    const now = new Date();

    await this.prisma.$transaction(async (transaction) => {
      await transaction.userQuestionProgress.upsert({
        where: {
          userId_questionId: {
            userId: input.userId,
            questionId: input.questionId,
          },
        },
        create: {
          userId: input.userId,
          questionId: input.questionId,
          userAnswer: input.userAnswer,
          isCorrect: input.isCorrect,
        },
        update: {
          userAnswer: input.userAnswer,
          isCorrect: input.isCorrect,
          attempts: { increment: 1 },
        },
      });

      const [
        totalQuestions,
        answeredQuestions,
        correctAnswers,
        currentProgress,
      ] = await Promise.all([
        transaction.quizQuestion.count({
          where: {
            quiz: {
              lessonId: input.lessonId,
              status: QuizStatus.ACTIVE,
            },
          },
        }),
        transaction.userQuestionProgress.count({
          where: {
            userId: input.userId,
            question: {
              quiz: {
                lessonId: input.lessonId,
                status: QuizStatus.ACTIVE,
              },
            },
          },
        }),
        transaction.userQuestionProgress.count({
          where: {
            userId: input.userId,
            isCorrect: true,
            question: {
              quiz: {
                lessonId: input.lessonId,
                status: QuizStatus.ACTIVE,
              },
            },
          },
        }),
        transaction.lessonProgress.findUnique({
          where: {
            userId_lessonId: {
              userId: input.userId,
              lessonId: input.lessonId,
            },
          },
          select: { completedAt: true },
        }),
      ]);

      const progressPercent =
        totalQuestions === 0
          ? 0
          : Math.round((answeredQuestions / totalQuestions) * 100);

      const status =
        progressPercent === 100
          ? LessonProgressStatus.COMPLETED
          : LessonProgressStatus.IN_PROGRESS;

      const completedAt =
        status === LessonProgressStatus.COMPLETED
          ? (currentProgress?.completedAt ?? now)
          : null;

      await transaction.lessonProgress.upsert({
        where: {
          userId_lessonId: { userId: input.userId, lessonId: input.lessonId },
        },
        create: {
          userId: input.userId,
          lessonId: input.lessonId,
          status,
          progressPercent,
          totalQuestions,
          answeredQuestions,
          correctAnswers,
          completedAt,
          lastStudiedAt: now,
        },
        update: {
          status,
          progressPercent,
          totalQuestions,
          answeredQuestions,
          correctAnswers,
          completedAt,
          lastStudiedAt: now,
        },
      });
    });
  }

  private async findAvailableLesson(lessonId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id: lessonId,
        status: LessonStatus.PUBLISHED,
        chapter: { curriculum: { status: CurriculumStatus.PUBLISHED } },
      },
      select: {
        id: true,
        quiz: {
          select: { status: true, _count: { select: { questions: true } } },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài học đang được xuất bản');
    }

    return {
      id: lesson.id,
      totalQuestions:
        lesson.quiz?.status === QuizStatus.ACTIVE
          ? lesson.quiz._count.questions
          : 0,
    };
  }

  private toResponse(progress: ProgressWithLesson) {
    const accuracyPercent =
      progress.answeredQuestions === 0
        ? 0
        : Math.round(
            (progress.correctAnswers / progress.answeredQuestions) * 100,
          );

    return {
      id: progress.id,
      lessonId: progress.lessonId,
      status: progress.status,
      progressPercent: progress.progressPercent,
      totalQuestions: progress.totalQuestions,
      answeredQuestions: progress.answeredQuestions,
      correctAnswers: progress.correctAnswers,
      accuracyPercent,
      startedAt: progress.startedAt,
      lastStudiedAt: progress.lastStudiedAt,
      completedAt: progress.completedAt,
      lesson: progress.lesson,
    };
  }
}
