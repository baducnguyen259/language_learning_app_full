import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { LessonStatus } from '../../../generated/prisma/enums';

export class UpdateLessonDto {
  @ApiPropertyOptional({ example: 'Bài 1: Xin chào', description: 'Tên bài học mới' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: 'Học cách chào hỏi cơ bản', description: 'Mô tả mới' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ example: 'cm123topic', description: 'ID chủ đề mới' })
  @IsOptional()
  @IsString()
  topicId?: string;

  @ApiPropertyOptional({ enum: LessonStatus, example: LessonStatus.PUBLISHED, description: 'Trạng thái xuất bản mới' })
  @IsOptional()
  @IsEnum(LessonStatus)
  status?: LessonStatus;

  @ApiPropertyOptional({ example: 20, minimum: 1, description: 'Thời lượng theo phút' })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @ApiPropertyOptional({ example: '/uploads/lessons/thumbnail.webp', description: 'Đường dẫn ảnh đại diện' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: false, description: 'Có yêu cầu hoàn thành bài trước không' })
  @IsOptional()
  @IsBoolean()
  requiresPreviousLesson?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Có cho phép học lại không' })
  @IsOptional()
  @IsBoolean()
  allowReplay?: boolean;

  @ApiPropertyOptional({ example: '2026-08-10T02:00:00.000Z', format: 'date-time', description: 'Thời điểm hẹn xuất bản' })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
