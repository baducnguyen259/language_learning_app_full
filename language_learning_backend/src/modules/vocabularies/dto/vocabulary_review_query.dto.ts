import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class VocabularyReviewQueryDto {
  @ApiPropertyOptional({
    example: 12,
    default: 12,
    minimum: 1,
    maximum: 50,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 12;

  @ApiPropertyOptional({
    example: 'cm123language',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  languageId?: string;

  @ApiPropertyOptional({
    example: 'cm123lesson',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lessonId?: string;
}
