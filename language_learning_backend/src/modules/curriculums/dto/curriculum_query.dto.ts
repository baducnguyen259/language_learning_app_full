import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CurriculumStatus } from '../../../generated/prisma/enums';

export class CurriculumQueryDto {
  @ApiPropertyOptional({ example: 'Tiếng Hàn' })
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

  @ApiPropertyOptional({
    enum: CurriculumStatus,
    example: CurriculumStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(CurriculumStatus)
  status?: CurriculumStatus;

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
