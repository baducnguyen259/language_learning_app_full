import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { QuizStatus, type Prisma } from '../../generated/prisma/client';
import { CreateQuizDto } from './dto/create_quiz.dto';
import { QuizQueryDto } from './dto/quiz_query.dto';
import { UpdateQuizDto } from './dto/update_quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForAdmin(query: QuizQueryDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const lessonWhere: Prisma.LessonWhereInput = {
      ...(query.topicId
        ? {
            topicId: query.topicId,
          }
        : {}),

      ...(query.levelId || query.languageId
        ? {
            topic: {
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
            },
          }
        : {}),
    };

    const hasLessonFilter =
      query.topicId !== undefined ||
      query.levelId !== undefined ||
      query.languageId !== undefined;

    const where: Prisma.QuizWhereInput = {
      ...(query.lessonId
        ? {
            lessonId: query.lessonId,
          }
        : {}),

      ...(hasLessonFilter
        ? {
            lesson: lessonWhere,
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
              {
                lesson: {
                  title: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.quiz.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: this.getQuizInclude(),
      }),

      this.prisma.quiz.count({
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
    const quiz = await this.prisma.quiz.findUnique({
      where: {
        id,
      },
      include: this.getQuizInclude(),
    });

    if (!quiz) {
      throw new NotFoundException('Không tìm thấy bài kiểm tra');
    }

    return quiz;
  }

  async create(dto: CreateQuizDto) {
    await this.ensureLessonExists(dto.lessonId);
    await this.ensureLessonDoesNotHaveQuiz(dto.lessonId);

    if (dto.status === QuizStatus.ACTIVE) {
      throw new BadRequestException(
        'Hãy tạo Quiz ở trạng thái DRAFT và thêm câu hỏi trước khi kích hoạt',
      );
    }

    return this.prisma.quiz.create({
      data: {
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        status: dto.status ?? QuizStatus.DRAFT,
        lessonId: dto.lessonId,
      },
      include: this.getQuizInclude(),
    });
  }

  async update(id: string, dto: UpdateQuizDto) {
    const currentQuiz = await this.prisma.quiz.findUnique({
      where: {
        id,
      },
    });

    if (!currentQuiz) {
      throw new NotFoundException('Không tìm thấy bài kiểm tra');
    }

    const targetLessonId = dto.lessonId ?? currentQuiz.lessonId;

    if (dto.lessonId !== undefined) {
      await this.ensureLessonExists(targetLessonId);
      await this.ensureLessonDoesNotHaveQuiz(targetLessonId, id);
    }

    if (dto.status === QuizStatus.ACTIVE) {
      await this.ensureQuizCanBeActivated(id);
    }

    return this.prisma.quiz.update({
      where: {
        id,
      },
      data: {
        title: dto.title !== undefined ? dto.title.trim() : undefined,

        description:
          dto.description !== undefined
            ? dto.description.trim() || null
            : undefined,

        status: dto.status,
        lessonId: dto.lessonId,
      },
      include: this.getQuizInclude(),
    });
  }

  async remove(id: string) {
    await this.findOneForAdmin(id);

    return this.prisma.quiz.delete({
      where: { id },
      include: this.getQuizInclude(),
    });
  }

  private async ensureLessonExists(lessonId: string): Promise<void> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true },
    });

    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài học');
    }
  }

  private async ensureLessonDoesNotHaveQuiz(
    lessonId: string,
    excludedQuizId?: string,
  ): Promise<void> {
    const duplicatedQuiz = await this.prisma.quiz.findFirst({
      where: {
        lessonId,

        ...(excludedQuizId
          ? {
              id: {
                not: excludedQuizId,
              },
            }
          : {}),
      },
      select: {
        id: true,
      },
    });

    if (duplicatedQuiz) {
      throw new ConflictException('Bài học này đã có bài kiểm tra');
    }
  }

  private async ensureQuizCanBeActivated(quizId: string): Promise<void> {
    const questionCount = await this.prisma.quizQuestion.count({
      where: {
        quizId,
      },
    });

    if (questionCount === 0) {
      throw new BadRequestException(
        'Quiz phải có ít nhất một câu hỏi trước khi kích hoạt',
      );
    }
  }

  private getQuizInclude() {
    return {
      lesson: {
        select: {
          id: true,
          title: true,
          topic: {
            select: {
              id: true,
              name: true,
              level: {
                select: {
                  id: true,
                  name: true,
                  order: true,
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
      },

      questions: {
        orderBy: { order: 'asc' as const },
        include: {
          options: {
            orderBy: {
              order: 'asc' as const,
            },
          },
        },
      },
    } as const;
  }
}
