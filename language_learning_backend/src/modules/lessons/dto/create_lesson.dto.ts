import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { LessonStatus } from '../../../generated/prisma/enums';

export class CreateLessonDto {
  @ApiProperty({ example: 'Bài 1: Xin chào', description: 'Tên bài học' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({
    example: 'Học cách chào hỏi cơ bản',
    description: 'Mô tả ngắn',
  })
  @IsOptional()
  @ApiProperty({ example: 'cm123topic', description: 'ID chủ đề chứa bài học' })
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsString()
  @IsNotEmpty()
  topicId!: string;

  @ApiPropertyOptional({
    enum: LessonStatus,
    example: LessonStatus.DRAFT,
    description: 'Trạng thái xuất bản',
  })
  @IsOptional()
  @IsEnum(LessonStatus)
  status?: LessonStatus;

  @ApiPropertyOptional({
    example: 15,
    minimum: 1,
    description: 'Thời lượng dự kiến theo phút',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @ApiPropertyOptional({
    example: '/uploads/lessons/thumbnail.webp',
    description: 'Đường dẫn ảnh đại diện',
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    example: false,
    default: false,
    description: 'Có yêu cầu hoàn thành bài trước không',
  })
  @IsOptional()
  @IsBoolean()
  requiresPreviousLesson?: boolean;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Có cho phép học lại không',
  })
  @IsOptional()
  @IsBoolean()
  allowReplay?: boolean;

  @ApiPropertyOptional({
    example: '2026-08-10T02:00:00.000Z',
    format: 'date-time',
    description: 'Thời điểm hẹn xuất bản',
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
