import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { VocabularyStatus } from '../../../generated/prisma/enums';

export class VocabularyQueryDto {
  @ApiPropertyOptional({
    example: 'xin chào',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'cm123language',
  })
  @IsOptional()
  @IsString()
  languageId?: string;

  @ApiPropertyOptional({
    example: 'cm123level',
  })
  @IsOptional()
  @IsString()
  levelId?: string;

  @ApiPropertyOptional({
    example: 'cm123topic',
  })
  @IsOptional()
  @IsString()
  topicId?: string;

  @ApiPropertyOptional({
    example: 'cm123lesson',
  })
  @IsOptional()
  @IsString()
  lessonId?: string;

  @ApiPropertyOptional({
    example: 'Động từ',
  })
  @IsOptional()
  @IsString()
  wordType?: string;

  @ApiPropertyOptional({
    enum: VocabularyStatus,
    example: VocabularyStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(VocabularyStatus)
  status?: VocabularyStatus;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 20,
    default: 20,
    maximum: 100,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
