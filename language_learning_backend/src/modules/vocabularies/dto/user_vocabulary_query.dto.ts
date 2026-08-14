import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export enum UserVocabularyFilter {
  ALL = 'ALL',
  LEARNING = 'LEARNING',
  MASTERED = 'MASTERED',
  FAVORITE = 'FAVORITE',
}

export class UserVocabularyQueryDto {
  @ApiPropertyOptional({
    enum: UserVocabularyFilter,
    default: UserVocabularyFilter.ALL,
  })
  @IsEnum(UserVocabularyFilter)
  filter: UserVocabularyFilter = UserVocabularyFilter.ALL;

  @ApiPropertyOptional({ example: 'xin chào' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ example: 'cm123language' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  languageId?: string;

  @ApiPropertyOptional({ example: 'cm123level' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  levelId?: string;

  @ApiPropertyOptional({ example: 'cm123topic' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  topicId?: string;

  @ApiPropertyOptional({ example: 'cm123lesson' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lessonId?: string;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
