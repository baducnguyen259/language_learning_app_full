import {
  BadRequestException,
  ConflictException,
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
import { FinishStudySessionDto } from './dto/finish_study_session.dto';

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

const studySessionSelect = {
  id: true,
  lessonId: true,
  startedAt: true,
  endedAt: true,
  durationSeconds: true,
  experienceEarned: true,
  lesson: {
    select: {
      id: true,
      title: true,
    },
  },
} satisfies Prisma.StudySessionSelect;

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
const CORRECT_ANSWER_EXPERIENCE = 10;

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

  async recordQuizAnswer(input: RecordQuizAnswerInput) {
    const now = new Date();

    return this.prisma.$transaction(async (transaction) => {
      const questionProgress = await transaction.userQuestionProgress.upsert({
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
        update: { attempts: { increment: 1 } },
        select: { id: true },
      });

      if (input.isCorrect) {
        await transaction.userQuestionProgress.update({
          where: { id: questionProgress.id },
          data: { userAnswer: input.userAnswer, isCorrect: true },
        });
      } else {
        await transaction.userQuestionProgress.updateMany({
          where: { id: questionProgress.id, isCorrect: false },
          data: { userAnswer: input.userAnswer },
        });
      }
      let experienceEarned = 0;
      if (input.isCorrect) {
        const experienceClaim =
          await transaction.userQuestionProgress.updateMany({
            where: {
              id: questionProgress.id,
              isCorrect: true,
              experienceEarned: 0,
            },
            data: {
              experienceEarned: CORRECT_ANSWER_EXPERIENCE,
            },
          });
        if (experienceClaim.count === 1) {
          experienceEarned = CORRECT_ANSWER_EXPERIENCE;
        }
      }
      const [
        totalQuestions,
        answeredQuestions,
        correctAnswers,
        currentProgress,
      ] = await Promise.all([
        transaction.quizQuestion.count({
          where: {
            quiz: { lessonId: input.lessonId, status: QuizStatus.ACTIVE },
          },
        }),
        transaction.userQuestionProgress.count({
          where: {
            userId: input.userId,
            question: {
              quiz: { lessonId: input.lessonId, status: QuizStatus.ACTIVE },
            },
          },
        }),

        transaction.userQuestionProgress.count({
          where: {
            userId: input.userId,
            isCorrect: true,
            question: {
              quiz: { lessonId: input.lessonId, status: QuizStatus.ACTIVE },
            },
          },
        }),
        transaction.lessonProgress.findUnique({
          where: {
            userId_lessonId: { userId: input.userId, lessonId: input.lessonId },
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

      const learningProfile = await transaction.userLearningProfile.upsert({
        where: { userId: input.userId },
        create: { userId: input.userId, totalExperience: experienceEarned },
        update: { totalExperience: { increment: experienceEarned } },
        select: { totalExperience: true },
      });

      if (experienceEarned > 0) {
        const activeSession = await transaction.studySession.findFirst({
          where: {
            userId: input.userId,
            lessonId: input.lessonId,
            endedAt: null,
          },
          orderBy: { startedAt: 'desc' },
          select: { id: true },
        });

        if (activeSession) {
          await transaction.studySession.update({
            where: { id: activeSession.id },
            data: { experienceEarned: { increment: experienceEarned } },
          });
        }
      }

      return {
        experienceEarned,
        totalExperience: learningProfile.totalExperience,
      };
    });
  }

  async startStudySession(userId: string, lessonId: string) {
    const lesson = await this.findAvailableLesson(lessonId);
    const activeSession = await this.prisma.studySession.findFirst({
      where: { userId, endedAt: null },
      orderBy: { startedAt: 'desc' },
      select: studySessionSelect,
    });
    if (activeSession) {
      if (activeSession.lessonId === lessonId) {
        return activeSession;
      }
      throw new ConflictException(
        'Bạn đang có một phiên học khác chưa kết thúc',
      );
    }
    const now = new Date();

    return this.prisma.$transaction(async (transaction) => {
      await transaction.userLearningProfile.upsert({
        where: { userId },
        create: { userId },
        update: {},
      });

      await transaction.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        create: {
          userId,
          lessonId,
          totalQuestions: lesson.totalQuestions,
          lastStudiedAt: now,
        },
        update: { totalQuestions: lesson.totalQuestions, lastStudiedAt: now },
      });
      return transaction.studySession.create({
        data: { userId, lessonId, startedAt: now },
        select: studySessionSelect,
      });
    });
  }

  async finishStudySession(
    userId: string,
    sessionId: string,
    dto: FinishStudySessionDto,
  ) {
    const session = await this.prisma.studySession.findFirst({
      where: { id: sessionId, userId },
      select: studySessionSelect,
    });
    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên học của người dùng');
    }
    if (session.endedAt) return session;
    const endedAt = new Date();
    const elapsedSeconds = Math.max(
      1,
      Math.floor((endedAt.getTime() - session.startedAt.getTime()) / 1000),
    );
    const durationSeconds = Math.min(dto.durationSeconds, elapsedSeconds + 60);
    return this.prisma.studySession.update({
      where: { id: session.id },
      data: { endedAt, durationSeconds },
      select: studySessionSelect,
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
