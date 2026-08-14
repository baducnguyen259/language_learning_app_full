import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { QuizQuestionType } from '../../../generated/prisma/enums';

export const PRACTICE_QUESTION_TYPES = [
  QuizQuestionType.matching,
  QuizQuestionType.sentenceOrder,
  QuizQuestionType.missingWord,
  QuizQuestionType.listeningInput,
] as const;

export type PracticeQuestionType = (typeof PRACTICE_QUESTION_TYPES)[number];

export class PracticeQuestionQueryDto {
  @ApiProperty({
    enum: PRACTICE_QUESTION_TYPES,
    example: QuizQuestionType.matching,
  })
  @IsIn(PRACTICE_QUESTION_TYPES)
  type!: PracticeQuestionType;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 50,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;

  @ApiPropertyOptional({
    example: 'cm123language',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  languageId?: string;
}
