import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CurriculumStatus,
  LessonStatus,
} from '../../../generated/prisma/enums';

class CurriculumLanguageDto {
  @ApiProperty({ example: 'cm123language' })
  id!: string;

  @ApiProperty({ example: 'Tiếng Hàn' })
  name!: string;

  @ApiProperty({ example: 'ko' })
  code!: string;
}

class CurriculumLevelDto {
  @ApiProperty({ example: 'cm123level' })
  id!: string;

  @ApiProperty({ example: 'Sơ cấp 1' })
  name!: string;

  @ApiProperty({ example: 1 })
  order!: number;

  @ApiProperty({ example: 'cm123language' })
  languageId!: string;

  @ApiProperty({ type: CurriculumLanguageDto })
  language!: CurriculumLanguageDto;
}

class ChapterLessonTopicDto {
  @ApiProperty({ example: 'cm123topic' })
  id!: string;

  @ApiProperty({ example: 'Chào hỏi' })
  name!: string;
}

export class ChapterLessonResponseDto {
  @ApiProperty({ example: 'cm123lesson' })
  id!: string;

  @ApiProperty({ example: 'Bài 1: Xin chào' })
  title!: string;

  @ApiProperty({ enum: LessonStatus, example: LessonStatus.PUBLISHED })
  status!: LessonStatus;

  @ApiProperty({ example: 'cm123topic' })
  topicId!: string;

  @ApiProperty({ example: 'cm123chapter', nullable: true })
  chapterId!: string | null;

  @ApiProperty({ example: 1, nullable: true })
  orderInChapter!: number | null;

  @ApiPropertyOptional({ type: ChapterLessonTopicDto })
  topic?: ChapterLessonTopicDto;
}

export class ChapterResponseDto {
  @ApiProperty({ example: 'cm123chapter' })
  id!: string;

  @ApiProperty({ example: 'Chương 1: Chào hỏi' })
  title!: string;

  @ApiProperty({ example: 'Các mẫu câu chào hỏi', nullable: true })
  description!: string | null;

  @ApiProperty({ example: 1 })
  order!: number;

  @ApiProperty({ example: 'cm123curriculum' })
  curriculumId!: string;

  @ApiProperty({ type: [ChapterLessonResponseDto] })
  lessons!: ChapterLessonResponseDto[];

  @ApiProperty({ example: '2026-08-11T10:00:00.000Z', format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-11T10:00:00.000Z', format: 'date-time' })
  updatedAt!: Date;
}

export class CurriculumResponseDto {
  @ApiProperty({ example: 'cm123curriculum' })
  id!: string;

  @ApiProperty({ example: 'Tiếng Hàn cơ bản' })
  title!: string;

  @ApiProperty({ example: 'Lộ trình cho người mới bắt đầu', nullable: true })
  description!: string | null;

  @ApiProperty({ enum: CurriculumStatus, example: CurriculumStatus.PUBLISHED })
  status!: CurriculumStatus;

  @ApiProperty({ example: 'cm123level' })
  levelId!: string;

  @ApiProperty({ type: CurriculumLevelDto })
  level!: CurriculumLevelDto;

  @ApiProperty({ type: [ChapterResponseDto] })
  chapters!: ChapterResponseDto[];

  @ApiProperty({ example: 3 })
  chapterCount!: number;

  @ApiProperty({ example: 12 })
  lessonCount!: number;

  @ApiProperty({ example: 85, minimum: 0, maximum: 100 })
  completionPercentage!: number;

  @ApiProperty({ example: '2026-08-11T10:00:00.000Z', format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-11T10:00:00.000Z', format: 'date-time' })
  updatedAt!: Date;
}
