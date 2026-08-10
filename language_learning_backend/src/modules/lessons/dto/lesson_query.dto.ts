import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { LessonStatus } from '../../../generated/prisma/enums';

export class LessonQueryDto {
  @ApiPropertyOptional({ example: 'Xin chào', description: 'Tìm theo tiêu đề hoặc mô tả' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'cm123language', description: 'Lọc theo ngôn ngữ' })
  @IsOptional()
  @IsString()
  languageId?: string;

  @ApiPropertyOptional({ example: 'cm123level', description: 'Lọc theo cấp độ' })
  @IsOptional()
  @IsString()
  levelId?: string;

  @ApiPropertyOptional({ example: 'cm123topic', description: 'Lọc theo chủ đề' })
  @IsOptional()
  @IsString()
  topicId?: string;

  @ApiPropertyOptional({ enum: LessonStatus, example: LessonStatus.DRAFT, description: 'Lọc theo trạng thái' })
  @IsOptional()
  @IsEnum(LessonStatus)
  status?: LessonStatus;

  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
