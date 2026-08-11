import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { GrammarStatus } from '../../../generated/prisma/enums';

export class GrammarQueryDto {
  @ApiPropertyOptional({ example: '이에요' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'cm123language' })
  @IsOptional()
  @IsString()
  languageId?: string;

  @ApiPropertyOptional({ example: 'cm123level' })
  @IsOptional()
  @IsString()
  levelId?: string;

  @ApiPropertyOptional({ example: 'cm123topic' })
  @IsOptional()
  @IsString()
  topicId?: string;

  @ApiPropertyOptional({ example: 'cm123lesson' })
  @IsOptional()
  @IsString()
  lessonId?: string;

  @ApiPropertyOptional({
    enum: GrammarStatus,
    example: GrammarStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(GrammarStatus)
  status?: GrammarStatus;

  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
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
