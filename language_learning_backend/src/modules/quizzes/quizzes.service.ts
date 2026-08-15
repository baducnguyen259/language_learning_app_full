import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import {
  CurriculumStatus,
  LessonStatus,
  QuizQuestionType,
  QuizStatus,
  VocabularyStatus,
  type Prisma,
} from '../../generated/prisma/client';
import { CreateQuizDto } from './dto/create_quiz.dto';
import { QuizQueryDto } from './dto/quiz_query.dto';
import { UpdateQuizDto } from './dto/update_quiz.dto';
import { UpdateQuizQuestionDto } from './dto/update_quiz_question.dto';
import {
  CreateQuizOptionDto,
  CreateQuizQuestionDto,
} from './dto/create_quiz_question.dto';
import { SubmitQuizAnswerDto } from './dto/submit_quiz_answer.dto';
import { ProgressService } from '../progress/progress.service';
import {
  PRACTICE_QUESTION_TYPES,
  PracticeQuestionQueryDto,
} from './dto/practice_question_query.dto';

const practiceQuestionSelect = {
  id: true,
  type: true,
  instruction: true,
  prompt: true,
  koreanText: true,
  romanization: true,
  translation: true,
  audioUrl: true,
  initialAnswer: true,
  options: {
    orderBy: { order: 'asc' },
    select: { optionKey: true, text: true, pairId: true },
  },
} satisfies Prisma.QuizQuestionSelect;

const practiceOverviewTypes = [
  QuizQuestionType.listeningInput,
  QuizQuestionType.pronunciation,
  QuizQuestionType.matching,
  QuizQuestionType.sentenceOrder,
  QuizQuestionType.missingWord,
] as const;

@Injectable()
export class QuizzesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly progressService: ProgressService,
  ) {}

  async findAllForAdmin(query: QuizQueryDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const lessonWhere: Prisma.LessonWhereInput = {
      ...(query.topicId ? { topicId: query.topicId } : {}),
      ...(query.levelId || query.languageId
        ? {
            topic: {
              ...(query.levelId ? { levelId: query.levelId } : {}),
              ...(query.languageId
                ? { level: { languageId: query.languageId } }
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
      ...(query.lessonId ? { lessonId: query.lessonId } : {}),
      ...(hasLessonFilter ? { lesson: lessonWhere } : {}),
      ...(query.status ? { status: query.status } : {}),

      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { lesson: { title: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.quiz.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: this.getQuizInclude(),
      }),
      this.prisma.quiz.count({ where }),
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
      where: { id },
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
      where: { id },
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
      where: { id },
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
  async findQuestionForAdmin(id: string) {
    const question = await this.prisma.quizQuestion.findUnique({
      where: { id },
      include: { options: { orderBy: { order: 'asc' } } },
    });
    if (!question) {
      throw new NotFoundException('Không tìm thấy câu hỏi');
    }
    return question;
  }

  async createQuestion(quizId: string, dto: CreateQuizQuestionDto) {
    await this.ensureQuizExists(quizId);
    await this.ensureQuestionOrderIsUnique(quizId, dto.order);
    const options = dto.options ?? [];
    this.validateQuestionOptions(dto.type, options);
    return this.prisma.quizQuestion.create({
      data: {
        type: dto.type,
        order: dto.order,
        instruction: dto.instruction.trim(),
        prompt: dto.prompt?.trim() || null,
        koreanText: dto.koreanText?.trim() || null,
        romanization: dto.romanization?.trim() || null,
        translation: dto.translation?.trim() || null,
        audioUrl: dto.audioUrl?.trim() || null,
        initialAnswer: this.normalizeAnswers(dto.initialAnswer ?? []),
        correctAnswer: this.normalizeRequiredAnswers(dto.correctAnswer),
        quizId,
        options: { create: this.prepareOptions(options) },
      },
      include: { options: { orderBy: { order: 'asc' } } },
    });
  }

  async updateQuestion(id: string, dto: UpdateQuizQuestionDto) {
    const currentQuestion = await this.prisma.quizQuestion.findUnique({
      where: { id },
      include: { options: { orderBy: { order: 'asc' } } },
    });

    if (!currentQuestion) {
      throw new NotFoundException('Không tìm thấy câu hỏi');
    }

    const targetOrder = dto.order ?? currentQuestion.order;
    const targetType = dto.type ?? currentQuestion.type;

    await this.ensureQuestionOrderIsUnique(
      currentQuestion.quizId,
      targetOrder,
      id,
    );

    const targetOptions =
      dto.options ??
      currentQuestion.options.map((option) => ({
        optionKey: option.optionKey,
        text: option.text,
        pairId: option.pairId ?? undefined,
        order: option.order,
      }));

    this.validateQuestionOptions(targetType, targetOptions);

    const correctAnswer =
      dto.correctAnswer !== undefined
        ? this.normalizeRequiredAnswers(dto.correctAnswer)
        : undefined;

    return this.prisma.quizQuestion.update({
      where: { id },
      data: {
        type: dto.type,
        order: dto.order,
        instruction:
          dto.instruction !== undefined ? dto.instruction.trim() : undefined,
        prompt:
          dto.prompt !== undefined ? dto.prompt.trim() || null : undefined,
        koreanText:
          dto.koreanText !== undefined
            ? dto.koreanText.trim() || null
            : undefined,
        romanization:
          dto.romanization !== undefined
            ? dto.romanization.trim() || null
            : undefined,
        translation:
          dto.translation !== undefined
            ? dto.translation.trim() || null
            : undefined,
        audioUrl:
          dto.audioUrl !== undefined ? dto.audioUrl.trim() || null : undefined,
        initialAnswer:
          dto.initialAnswer !== undefined
            ? this.normalizeAnswers(dto.initialAnswer)
            : undefined,
        correctAnswer,
        options:
          dto.options !== undefined
            ? {
                deleteMany: {},
                create: this.prepareOptions(dto.options),
              }
            : undefined,
      },
      include: { options: { orderBy: { order: 'asc' } } },
    });
  }

  async removeQuestion(id: string) {
    const question = await this.findQuestionForAdmin(id);
    await this.ensureQuestionCanBeRemoved(question.quizId);
    return this.prisma.quizQuestion.delete({
      where: { id },
      include: { options: { orderBy: { order: 'asc' } } },
    });
  }

  async findQuestionsForApp(lessonId: string) {
    const quiz = await this.prisma.quiz.findFirst({
      where: {
        lessonId,
        status: QuizStatus.ACTIVE,
        lesson: {
          status: LessonStatus.PUBLISHED,
          chapter: { curriculum: { status: CurriculumStatus.PUBLISHED } },
        },
      },
      select: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            type: true,
            instruction: true,
            prompt: true,
            koreanText: true,
            romanization: true,
            translation: true,
            audioUrl: true,
            initialAnswer: true,
            options: {
              orderBy: { order: 'asc' },
              select: { optionKey: true, text: true, pairId: true },
            },
          },
        },
      },
    });

    if (!quiz) {
      return [];
    }
    const totalQuestions = quiz.questions.length;
    return quiz.questions.map((question, index) => {
      const hideListeningAnswer =
        question.type === QuizQuestionType.listeningInput;
      return {
        id: question.id,
        type: question.type,
        questionNumber: index + 1,
        totalQuestions,
        instruction: question.instruction,
        prompt: question.prompt ?? '',
        koreanText: hideListeningAnswer ? '' : (question.koreanText ?? ''),
        romanization: hideListeningAnswer ? '' : (question.romanization ?? ''),
        translation: hideListeningAnswer ? '' : (question.translation ?? ''),
        audioUrl: question.audioUrl ?? '',
        options: question.options.map((option) => ({
          id: option.optionKey,
          text: option.text,
          pairId: option.pairId,
          isMatched: question.initialAnswer.includes(option.optionKey),
        })),
        initialAnswer: question.initialAnswer,
      };
    });
  }

  async getPracticeOverview(userId: string) {
    const publishedLessonWhere: Prisma.LessonWhereInput = {
      status: LessonStatus.PUBLISHED,
      chapter: { curriculum: { status: CurriculumStatus.PUBLISHED } },
      progressRecords: { some: { userId } },
    };

    const questionWhere: Prisma.QuizQuestionWhereInput = {
      quiz: {
        status: QuizStatus.ACTIVE,
        lesson: publishedLessonWhere,
      },
    };

    const [totalVocabularyAvailable, ...questionCounts] = await Promise.all([
      this.prisma.userVocabularyProgress.count({
        where: {
          userId,
          vocabulary: {
            status: VocabularyStatus.ACTIVE,
            lesson: {
              status: LessonStatus.PUBLISHED,
              chapter: { curriculum: { status: CurriculumStatus.PUBLISHED } },
            },
          },
        },
      }),

      ...practiceOverviewTypes.map((type) =>
        this.prisma.quizQuestion.count({
          where: { ...questionWhere, type },
        }),
      ),
    ]);
    const supportedTypes = new Set<QuizQuestionType>(PRACTICE_QUESTION_TYPES);
    const modes = practiceOverviewTypes.map((type, index) => {
      const availableQuestions = questionCounts[index] ?? 0;
      return {
        type,
        availableQuestions,
        isAvailable: supportedTypes.has(type) && availableQuestions > 0,
      };
    });
    return {
      quickReviewCount: Math.min(12, totalVocabularyAvailable),
      totalVocabularyAvailable,
      modes,
    };
  }

  async findPracticeQuestions(userId: string, query: PracticeQuestionQueryDto) {
    const where: Prisma.QuizQuestionWhereInput = {
      type: query.type,
      quiz: {
        status: QuizStatus.ACTIVE,
        lesson: {
          status: LessonStatus.PUBLISHED,
          chapter: { curriculum: { status: CurriculumStatus.PUBLISHED } },
          progressRecords: { some: { userId } },
          ...(query.languageId
            ? { topic: { level: { languageId: query.languageId } } }
            : {}),
        },
      },
    };

    const [
      incorrectQuestions,
      unansweredQuestions,
      correctQuestions,
      totalAvailable,
    ] = await this.prisma.$transaction([
      this.prisma.quizQuestion.findMany({
        where: {
          ...where,
          userProgressRecords: {
            some: { userId, isCorrect: false },
          },
        },
        take: query.limit,
        orderBy: { updatedAt: 'asc' },
        select: practiceQuestionSelect,
      }),

      this.prisma.quizQuestion.findMany({
        where: {
          ...where,
          userProgressRecords: { none: { userId } },
        },
        take: query.limit,
        orderBy: { createdAt: 'asc' },
        select: practiceQuestionSelect,
      }),

      this.prisma.quizQuestion.findMany({
        where: {
          ...where,
          userProgressRecords: {
            some: { userId, isCorrect: true },
          },
        },
        take: query.limit,
        orderBy: { updatedAt: 'asc' },
        select: practiceQuestionSelect,
      }),

      this.prisma.quizQuestion.count({ where }),
    ]);

    const questions = [
      ...incorrectQuestions,
      ...unansweredQuestions,
      ...correctQuestions,
    ].slice(0, query.limit);

    const totalQuestions = questions.length;

    const items = questions.map((question, index) => {
      const hideListeningAnswer =
        question.type === QuizQuestionType.listeningInput;

      return {
        id: question.id,
        type: question.type,
        questionNumber: index + 1,
        totalQuestions,
        instruction: question.instruction,
        prompt: question.prompt ?? '',
        koreanText: hideListeningAnswer ? '' : (question.koreanText ?? ''),
        romanization: hideListeningAnswer ? '' : (question.romanization ?? ''),
        translation: hideListeningAnswer ? '' : (question.translation ?? ''),
        audioUrl: question.audioUrl ?? '',
        options: question.options.map((option) => ({
          id: option.optionKey,
          text: option.text,
          pairId: option.pairId,
          isMatched: question.initialAnswer.includes(option.optionKey),
        })),
        initialAnswer: question.initialAnswer,
      };
    });

    return {
      type: query.type,
      items,
      totalAvailable,
      limit: query.limit,
    };
  }

  async submitAnswer(
    userId: string,
    questionId: string,
    dto: SubmitQuizAnswerDto,
  ) {
    const question = await this.prisma.quizQuestion.findFirst({
      where: {
        id: questionId,
        quiz: {
          status: QuizStatus.ACTIVE,
          lesson: {
            status: LessonStatus.PUBLISHED,
            chapter: { curriculum: { status: CurriculumStatus.PUBLISHED } },
          },
        },
      },
      select: {
        id: true,
        type: true,
        correctAnswer: true,
        quiz: { select: { lessonId: true } },
      },
    });

    if (!question) {
      throw new NotFoundException('Không tìm thấy câu hỏi đang hoạt động');
    }
    if (question.type === QuizQuestionType.pronunciation) {
      throw new BadRequestException(
        'Câu phát âm cần sử dụng API chấm phát âm riêng',
      );
    }

    const userAnswer = this.normalizeRequiredAnswers(dto.userAnswer);
    const normalizedUserAnswer = this.normalizeAnswersForComparison(userAnswer);
    const normalizedCorrectAnswer = this.normalizeAnswersForComparison(
      question.correctAnswer,
    );

    const isCorrect = this.areAnswersEqual(
      normalizedUserAnswer,
      normalizedCorrectAnswer,
    );
    const experienceResult = await this.progressService.recordQuizAnswer({
      userId,
      lessonId: question.quiz.lessonId,
      questionId: question.id,
      userAnswer,
      isCorrect,
    });

    return {
      questionId: question.id,
      isCorrect,
      score: isCorrect ? 1 : 0,
      experienceEarned: experienceResult.experienceEarned,
      totalExperience: experienceResult.totalExperience,
      userAnswer,
      correctAnswer: question.correctAnswer,
      feedback: isCorrect ? 'Chính xác!' : 'Chưa chính xác.',
      pronunciationSegments: [],
    };
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
        ...(excludedQuizId ? { id: { not: excludedQuizId } } : {}),
      },
      select: { id: true },
    });

    if (duplicatedQuiz) {
      throw new ConflictException('Bài học này đã có bài kiểm tra');
    }
  }
  private async ensureQuizCanBeActivated(quizId: string): Promise<void> {
    const questionCount = await this.prisma.quizQuestion.count({
      where: { quizId },
    });
    if (questionCount === 0) {
      throw new BadRequestException(
        'Quiz phải có ít nhất một câu hỏi trước khi kích hoạt',
      );
    }
  }
  private async ensureQuizExists(quizId: string): Promise<void> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      select: { id: true },
    });

    if (!quiz) {
      throw new NotFoundException('Không tìm thấy bài kiểm tra');
    }
  }

  private async ensureQuestionOrderIsUnique(
    quizId: string,
    order: number,
    excludedQuestionId?: string,
  ): Promise<void> {
    const duplicatedQuestion = await this.prisma.quizQuestion.findFirst({
      where: {
        quizId,
        order,
        ...(excludedQuestionId ? { id: { not: excludedQuestionId } } : {}),
      },
      select: { id: true },
    });
    if (duplicatedQuestion) {
      throw new ConflictException('Thứ tự câu hỏi đã tồn tại trong Quiz');
    }
  }

  private validateQuestionOptions(
    type: QuizQuestionType,
    options: CreateQuizOptionDto[],
  ): void {
    const optionKeys = options.map((option) =>
      option.optionKey.trim().toLowerCase(),
    );

    const optionOrders = options.map((option) => option.order);

    if (new Set(optionKeys).size !== optionKeys.length) {
      throw new ConflictException(
        'optionKey không được trùng trong cùng câu hỏi',
      );
    }

    if (new Set(optionOrders).size !== optionOrders.length) {
      throw new ConflictException('Thứ tự lựa chọn không được trùng');
    }

    if (type === QuizQuestionType.matching && options.length !== 8) {
      throw new BadRequestException(
        'Câu hỏi matching hiện cần đúng 8 lựa chọn',
      );
    }

    if (type === QuizQuestionType.matching) {
      const pairCounts = new Map<string, number>();
      for (const option of options) {
        const pairId = option.pairId?.trim();
        if (!pairId) {
          throw new BadRequestException('Mọi lựa chọn matching phải có pairId');
        }
        pairCounts.set(pairId, (pairCounts.get(pairId) ?? 0) + 1);
      }
      const hasInvalidPair = [...pairCounts.values()].some(
        (count) => count !== 2,
      );
      if (hasInvalidPair) {
        throw new BadRequestException(
          'Mỗi pairId của câu matching phải xuất hiện đúng hai lần',
        );
      }
    }
    if (type === QuizQuestionType.missingWord && options.length !== 4) {
      throw new BadRequestException(
        'Câu hỏi missingWord hiện cần đúng 4 lựa chọn',
      );
    }
    if (type === QuizQuestionType.sentenceOrder && options.length === 0) {
      throw new BadRequestException('Câu hỏi sentenceOrder phải có lựa chọn');
    }
  }

  private prepareOptions(options: CreateQuizOptionDto[]) {
    return options.map((option) => ({
      optionKey: option.optionKey.trim(),
      text: option.text.trim(),
      pairId: option.pairId?.trim() || null,
      order: option.order,
    }));
  }

  private normalizeAnswers(answers: string[]): string[] {
    const normalizedAnswers = answers.map((answer) => answer.trim());
    if (normalizedAnswers.some((answer) => !answer)) {
      throw new BadRequestException('Đáp án không được là chuỗi rỗng');
    }
    return normalizedAnswers;
  }

  private normalizeRequiredAnswers(answers: string[]): string[] {
    const normalizedAnswers = this.normalizeAnswers(answers);
    if (normalizedAnswers.length === 0) {
      throw new BadRequestException('Câu hỏi phải có ít nhất một đáp án đúng');
    }
    return normalizedAnswers;
  }

  private async ensureQuestionCanBeRemoved(quizId: string): Promise<void> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        status: true,
        _count: { select: { questions: true } },
      },
    });

    if (quiz?.status === QuizStatus.ACTIVE && quiz._count.questions <= 1) {
      throw new BadRequestException(
        'Không thể xóa câu hỏi cuối cùng của Quiz đang ACTIVE. Hãy chuyển Quiz về DRAFT trước',
      );
    }
  }
  private normalizeAnswersForComparison(answers: string[]): string[] {
    return answers.map((answer) =>
      answer.normalize('NFC').trim().toLowerCase().replace(/\s+/g, ' '),
    );
  }

  private areAnswersEqual(first: string[], second: string[]): boolean {
    if (first.length !== second.length) {
      return false;
    }
    for (let index = 0; index < first.length; index++) {
      if (first[index] !== second[index]) {
        return false;
      }
    }
    return true;
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
                  language: { select: { id: true, name: true, code: true } },
                },
              },
            },
          },
        },
      },
      questions: {
        orderBy: { order: 'asc' as const },
        include: { options: { orderBy: { order: 'asc' as const } } },
      },
    } as const;
  }
}
