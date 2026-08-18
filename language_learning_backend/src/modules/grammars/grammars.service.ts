import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { GrammarStatus, type Prisma } from '../../generated/prisma/client';
import { GrammarQueryDto } from './dto/grammar_query.dto';
import { UpdateGrammarDto } from './dto/update_grammar.dto';
import { CreateGrammarDto } from './dto/create_grammar.dto';
import { ApiErrorCode } from '../../common/enums/api_error_code.enum';

@Injectable()
export class GrammarsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForAdmin(query: GrammarQueryDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const lessonWhere: Prisma.LessonWhereInput = {
      ...(query.topicId ? { topicId: query.topicId } : {}),

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

    const where: Prisma.GrammarWhereInput = {
      ...(query.lessonId ? { lessonId: query.lessonId } : {}),

      ...(hasLessonFilter ? { lesson: lessonWhere } : {}),

      ...(query.status ? { status: query.status } : {}),

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
                pattern: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                explanation: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                example: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                exampleMeaning: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                note: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.grammar.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          {
            lessonId: 'asc',
          },
          {
            order: 'asc',
          },
        ],
        include: this.getLessonInclude(),
      }),

      this.prisma.grammar.count({
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
    const grammar = await this.prisma.grammar.findUnique({
      where: {
        id,
      },
      include: this.getLessonInclude(),
    });

    if (!grammar) {
      throw new NotFoundException({
        code: ApiErrorCode.GRAMMAR_NOT_FOUND,
        message: 'Không tìm thấy điểm ngữ pháp',
      });
    }

    return grammar;
  }
  async findAllForApp(query: GrammarQueryDto) {
    return this.findAllForAdmin({
      ...query,
      status: GrammarStatus.ACTIVE,
    });
  }

  async findOneForApp(id: string) {
    const grammar = await this.prisma.grammar.findFirst({
      where: {
        id,
        status: GrammarStatus.ACTIVE,
      },

      include: this.getLessonInclude(),
    });

    if (!grammar) {
      throw new NotFoundException({
        code: ApiErrorCode.GRAMMAR_NOT_FOUND,
        message: 'Không tìm thấy điểm ngữ pháp',
      });
    }

    return grammar;
  }

  async create(dto: CreateGrammarDto) {
    await this.ensureLessonExists(dto.lessonId);

    const title = dto.title.trim();

    await this.ensureGrammarIsUnique(dto.lessonId, title, dto.order);

    return this.prisma.grammar.create({
      data: {
        title,
        pattern: dto.pattern.trim(),
        explanation: dto.explanation.trim(),

        example: dto.example?.trim() || null,

        exampleMeaning: dto.exampleMeaning?.trim() || null,

        note: dto.note?.trim() || null,

        order: dto.order,
        status: dto.status ?? GrammarStatus.DRAFT,
        lessonId: dto.lessonId,
      },

      include: this.getLessonInclude(),
    });
  }
  async update(id: string, dto: UpdateGrammarDto) {
    const currentGrammar = await this.prisma.grammar.findUnique({
      where: {
        id,
      },
    });

    if (!currentGrammar) {
      throw new NotFoundException({
        code: ApiErrorCode.GRAMMAR_NOT_FOUND,
        message: 'Không tìm thấy điểm ngữ pháp',
      });
    }

    const targetLessonId = dto.lessonId ?? currentGrammar.lessonId;

    const targetTitle = dto.title?.trim() ?? currentGrammar.title;

    const targetOrder = dto.order ?? currentGrammar.order;

    if (dto.lessonId !== undefined) {
      await this.ensureLessonExists(targetLessonId);
    }

    await this.ensureGrammarIsUnique(
      targetLessonId,
      targetTitle,
      targetOrder,
      id,
    );

    return this.prisma.grammar.update({
      where: {
        id,
      },

      data: {
        title: dto.title !== undefined ? dto.title.trim() : undefined,

        pattern: dto.pattern !== undefined ? dto.pattern.trim() : undefined,

        explanation:
          dto.explanation !== undefined ? dto.explanation.trim() : undefined,

        example:
          dto.example !== undefined ? dto.example.trim() || null : undefined,

        exampleMeaning:
          dto.exampleMeaning !== undefined
            ? dto.exampleMeaning.trim() || null
            : undefined,

        note: dto.note !== undefined ? dto.note.trim() || null : undefined,

        order: dto.order,
        status: dto.status,
        lessonId: dto.lessonId,
      },

      include: this.getLessonInclude(),
    });
  }

  async remove(id: string) {
    await this.findOneForAdmin(id);

    return this.prisma.grammar.delete({
      where: {
        id,
      },
    });
  }

  private async ensureLessonExists(lessonId: string): Promise<void> {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      select: {
        id: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException({
        code: ApiErrorCode.LESSON_NOT_FOUND,
        message: 'Không tìm thấy bài học',
      });
    }
  }

  private async ensureGrammarIsUnique(
    lessonId: string,
    title: string,
    order: number,
    excludedId?: string,
  ): Promise<void> {
    const duplicatedGrammar = await this.prisma.grammar.findFirst({
      where: {
        ...(excludedId
          ? {
              id: {
                not: excludedId,
              },
            }
          : {}),

        lessonId,

        OR: [
          {
            title: {
              equals: title,
              mode: 'insensitive',
            },
          },
          {
            order,
          },
        ],
      },

      select: {
        id: true,
        title: true,
        order: true,
      },
    });

    if (!duplicatedGrammar) {
      return;
    }

    if (duplicatedGrammar.order === order) {
      throw new ConflictException({
        code: ApiErrorCode.GRAMMAR_ORDER_ALREADY_EXISTS,
        message: 'Thứ tự ngữ pháp đã tồn tại trong bài học',
      });
    }

    throw new ConflictException({
      code: ApiErrorCode.GRAMMAR_TITLE_ALREADY_EXISTS,
      message: 'Tên ngữ pháp đã tồn tại trong bài học',
    });
  }
  private getLessonInclude() {
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
    } as const;
  }
}
