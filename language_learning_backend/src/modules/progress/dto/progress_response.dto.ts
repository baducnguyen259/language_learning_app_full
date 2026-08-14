import { ApiProperty } from '@nestjs/swagger';

import { LessonProgressStatus } from '../../../generated/prisma/enums';

class ProgressLessonChapterResponseDto {
  @ApiProperty({ example: 'cm123chapter' })
  id!: string;

  @ApiProperty({ example: 'Chương 1: Chào hỏi' })
  title!: string;

  @ApiProperty({ example: 1 })
  order!: number;

  @ApiProperty({ example: 'cm123curriculum' })
  curriculumId!: string;
}

class ProgressLessonResponseDto {
  @ApiProperty({ example: 'cm123lesson' })
  id!: string;

  @ApiProperty({ example: 'Bài 1: Xin chào' })
  title!: string;

  @ApiProperty({ example: 15, nullable: true })
  durationMinutes!: number | null;

  @ApiProperty({
    example: '/uploads/lessons/lesson-1.webp',
    nullable: true,
  })
  thumbnailUrl!: string | null;

  @ApiProperty({
    type: ProgressLessonChapterResponseDto,
    nullable: true,
  })
  chapter!: ProgressLessonChapterResponseDto | null;
}

export class ProgressResponseDto {
  @ApiProperty({ example: 'cm123progress' })
  id!: string;

  @ApiProperty({ example: 'cm123lesson' })
  lessonId!: string;

  @ApiProperty({
    enum: LessonProgressStatus,
    example: LessonProgressStatus.IN_PROGRESS,
  })
  status!: LessonProgressStatus;

  @ApiProperty({ example: 60, minimum: 0, maximum: 100 })
  progressPercent!: number;

  @ApiProperty({ example: 5 })
  totalQuestions!: number;

  @ApiProperty({ example: 3 })
  answeredQuestions!: number;

  @ApiProperty({ example: 2 })
  correctAnswers!: number;

  @ApiProperty({ example: 67, minimum: 0, maximum: 100 })
  accuracyPercent!: number;

  @ApiProperty({
    example: '2026-08-14T02:00:00.000Z',
    format: 'date-time',
  })
  startedAt!: Date;

  @ApiProperty({
    example: '2026-08-14T02:15:00.000Z',
    format: 'date-time',
  })
  lastStudiedAt!: Date;

  @ApiProperty({
    example: null,
    format: 'date-time',
    nullable: true,
  })
  completedAt!: Date | null;

  @ApiProperty({ type: ProgressLessonResponseDto })
  lesson!: ProgressLessonResponseDto;
}
