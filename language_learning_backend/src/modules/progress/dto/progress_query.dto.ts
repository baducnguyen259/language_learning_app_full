import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

import { LessonProgressStatus } from '../../../generated/prisma/enums';

export class ProgressQueryDto {
  @ApiPropertyOptional({
    enum: LessonProgressStatus,
    example: LessonProgressStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(LessonProgressStatus)
  status?: LessonProgressStatus;

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
