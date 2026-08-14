import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import type { Prisma } from '../../generated/prisma/client';
import {
  CurriculumStatus,
  LessonStatus,
  VocabularyLearningStatus,
  VocabularyStatus,
} from '../../generated/prisma/enums';
import { FavoriteQueryDto } from './dto/favorite_query.dto';

const vocabularyFavoriteSelect = {
  id: true,
  vocabularyId: true,
  createdAt: true,
  vocabulary: {
    select: {
      id: true,
      term: true,
      pronunciation: true,
      meaning: true,
      wordType: true,
      imageUrl: true,
      audioUrl: true,
      lessonId: true,
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
                    select: { id: true, name: true, code: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.VocabularyFavoriteSelect;

type VocabularyFavoriteFromDatabase = Prisma.VocabularyFavoriteGetPayload<{
  select: typeof vocabularyFavoriteSelect;
}>;

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findVocabularyFavorites(userId: string, query: FavoriteQueryDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const vocabularyWhere: Prisma.VocabularyWhereInput = {
      status: VocabularyStatus.ACTIVE,

      ...(query.lessonId ? { lessonId: query.lessonId } : {}),

      ...(search
        ? {
            OR: [
              {
                term: { contains: search, mode: 'insensitive' },
              },
              {
                pronunciation: { contains: search, mode: 'insensitive' },
              },
              {
                meaning: { contains: search, mode: 'insensitive' },
              },
            ],
          }
        : {}),

      lesson: {
        status: LessonStatus.PUBLISHED,
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
        chapter: { curriculum: { status: CurriculumStatus.PUBLISHED } },
      },
    };

    const where: Prisma.VocabularyFavoriteWhereInput = {
      userId,
      vocabulary: vocabularyWhere,
    };

    const [favorites, total] = await this.prisma.$transaction([
      this.prisma.vocabularyFavorite.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: vocabularyFavoriteSelect,
      }),

      this.prisma.vocabularyFavorite.count({ where }),
    ]);

    return {
      items: favorites.map((favorite) => this.toResponse(favorite)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async addVocabularyFavorite(userId: string, vocabularyId: string) {
    const favorite = await this.prisma.$transaction(async (transaction) => {
      const vocabulary = await transaction.vocabulary.findFirst({
        where: {
          id: vocabularyId,
          status: VocabularyStatus.ACTIVE,
          lesson: {
            status: LessonStatus.PUBLISHED,
            chapter: { curriculum: { status: CurriculumStatus.PUBLISHED } },
          },
        },
        select: { id: true },
      });

      if (!vocabulary) {
        throw new NotFoundException(
          'Không tìm thấy từ vựng đang được xuất bản',
        );
      }

      await transaction.userVocabularyProgress.upsert({
        where: { userId_vocabularyId: { userId, vocabularyId } },
        create: {
          userId,
          vocabularyId,
          status: VocabularyLearningStatus.LEARNING,
        },
        update: {},
      });

      return transaction.vocabularyFavorite.upsert({
        where: {
          userId_vocabularyId: { userId, vocabularyId },
        },
        create: { userId, vocabularyId },
        update: {},
        select: vocabularyFavoriteSelect,
      });
    });

    return this.toResponse(favorite);
  }

  async removeVocabularyFavorite(userId: string, vocabularyId: string) {
    await this.prisma.vocabularyFavorite.deleteMany({
      where: { userId, vocabularyId },
    });
    return { vocabularyId, isFavorite: false };
  }

  private toResponse(favorite: VocabularyFavoriteFromDatabase) {
    return { ...favorite, isFavorite: true as const };
  }
}
