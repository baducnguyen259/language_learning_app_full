import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { LessonStatus } from '../../../generated/prisma/enums';

class LessonLanguageDto {
  @ApiProperty({ example: 'cm123language' })
  id!: string;

  @ApiProperty({ example: 'Tiếng Anh' })
  name!: string;

  @ApiProperty({ example: 'en' })
  code!: string;
}

class LessonLevelDto {
  @ApiProperty({ example: 'cm123level' })
  id!: string;

  @ApiProperty({ example: 'A1' })
  name!: string;

  @ApiProperty({ type: LessonLanguageDto })
  language!: LessonLanguageDto;
}

class LessonTopicDto {
  @ApiProperty({ example: 'cm123topic' })
  id!: string;

  @ApiProperty({ example: 'Chào hỏi' })
  name!: string;

  @ApiProperty({ type: LessonLevelDto })
  level!: LessonLevelDto;
}

export class LessonResponseDto {
  @ApiProperty({ example: 'cm123lesson' })
  id!: string;

  @ApiProperty({ example: 'Bài 1: Xin chào' })
  title!: string;

  @ApiProperty({ example: 'Học cách chào hỏi cơ bản', nullable: true })
  description!: string | null;

  @ApiProperty({ example: 'cm123topic' })
  topicId!: string;

  @ApiPropertyOptional({ type: LessonTopicDto })
  topic?: LessonTopicDto;

  @ApiProperty({ enum: LessonStatus, example: LessonStatus.DRAFT })
  status!: LessonStatus;

  @ApiProperty({ example: 15, nullable: true })
  durationMinutes!: number | null;

  @ApiProperty({ example: '/uploads/lessons/thumbnail.webp', nullable: true })
  thumbnailUrl!: string | null;

  @ApiProperty({ example: false })
  requiresPreviousLesson!: boolean;

  @ApiProperty({ example: true })
  allowReplay!: boolean;

  @ApiProperty({ example: null, format: 'date-time', nullable: true })
  scheduledAt!: Date | null;

  @ApiProperty({ example: null, format: 'date-time', nullable: true })
  publishedAt!: Date | null;

  @ApiProperty({ example: '2026-08-10T10:00:00.000Z', format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-10T10:00:00.000Z', format: 'date-time' })
  updatedAt!: Date;
}
