import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationMetaDto } from '../../../common/dto/api_response.dto';
import { VocabularyLearningStatus } from '../../../generated/prisma/enums';

export class UserVocabularyResponseDto {
  @ApiProperty({ example: 'cm123vocabulary' })
  id!: string;

  @ApiProperty({ example: '안녕하세요' })
  term!: string;

  @ApiPropertyOptional({ example: 'annyeonghaseyo', nullable: true })
  pronunciation!: string | null;

  @ApiProperty({ example: 'Xin chào' })
  meaning!: string;

  @ApiPropertyOptional({ example: 'Thán từ', nullable: true })
  wordType!: string | null;

  @ApiPropertyOptional({ nullable: true })
  imageUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  audioUrl!: string | null;

  @ApiProperty({ example: 'cm123lesson' })
  lessonId!: string;

  @ApiProperty({
    enum: VocabularyLearningStatus,
  })
  learningStatus!: VocabularyLearningStatus;

  @ApiProperty({ example: true })
  isFavorite!: boolean;

  @ApiProperty({ format: 'date-time' })
  learnedAt!: Date;

  @ApiPropertyOptional({
    format: 'date-time',
    nullable: true,
  })
  masteredAt!: Date | null;
}

export class UserVocabularyCountsResponseDto {
  @ApiProperty({ example: 126 })
  all!: number;

  @ApiProperty({ example: 45 })
  learning!: number;

  @ApiProperty({ example: 81 })
  mastered!: number;

  @ApiProperty({ example: 12 })
  favorite!: number;
}

export class UserVocabularyListResponseDto {
  @ApiProperty({
    type: UserVocabularyResponseDto,
    isArray: true,
  })
  items!: UserVocabularyResponseDto[];

  @ApiProperty({
    type: UserVocabularyCountsResponseDto,
  })
  counts!: UserVocabularyCountsResponseDto;

  @ApiProperty({
    type: PaginationMetaDto,
  })
  meta!: PaginationMetaDto;
}

export class UserVocabularyLearningStatusResponseDto {
  @ApiProperty({ example: 'cm123vocabulary' })
  vocabularyId!: string;

  @ApiProperty({ enum: VocabularyLearningStatus })
  learningStatus!: VocabularyLearningStatus;

  @ApiPropertyOptional({
    format: 'date-time',
    nullable: true,
  })
  masteredAt!: Date | null;
}

export class UserVocabularyReviewQueueResponseDto {
  @ApiProperty({
    type: UserVocabularyResponseDto,
    isArray: true,
  })
  items!: UserVocabularyResponseDto[];

  @ApiProperty({
    example: 45,
    description: 'Tổng số từ có thể ôn tập',
  })
  totalAvailable!: number;

  @ApiProperty({
    example: 12,
    description: 'Số từ tối đa được yêu cầu',
  })
  limit!: number;
}
