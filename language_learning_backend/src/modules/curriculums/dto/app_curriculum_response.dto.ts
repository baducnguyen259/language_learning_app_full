import { ApiProperty } from '@nestjs/swagger';

class AppCurriculumLanguageResponseDto {
  @ApiProperty({ example: 'cm123language' })
  id!: string;

  @ApiProperty({ example: 'Tiếng Hàn' })
  name!: string;

  @ApiProperty({ example: 'ko' })
  code!: string;
}

class AppCurriculumLevelResponseDto {
  @ApiProperty({ example: 'cm123level' })
  id!: string;

  @ApiProperty({ example: 'Sơ cấp 1' })
  name!: string;

  @ApiProperty({ example: 1 })
  order!: number;

  @ApiProperty({ type: AppCurriculumLanguageResponseDto })
  language!: AppCurriculumLanguageResponseDto;
}

class AppCurriculumTopicResponseDto {
  @ApiProperty({ example: 'cm123topic' })
  id!: string;

  @ApiProperty({ example: 'Chào hỏi' })
  name!: string;
}

class AppCurriculumLessonResponseDto {
  @ApiProperty({ example: 'cm123lesson' })
  id!: string;

  @ApiProperty({ example: 'Bài 1: Xin chào' })
  title!: string;

  @ApiProperty({
    example: 'Học cách chào hỏi cơ bản',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({ example: 'cm123topic' })
  topicId!: string;

  @ApiProperty({ type: AppCurriculumTopicResponseDto })
  topic!: AppCurriculumTopicResponseDto;

  @ApiProperty({ example: 'cm123chapter', nullable: true })
  chapterId!: string | null;

  @ApiProperty({ example: 1, nullable: true })
  orderInChapter!: number | null;

  @ApiProperty({ example: 15, nullable: true })
  durationMinutes!: number | null;

  @ApiProperty({
    example: '/uploads/lessons/lesson-1.webp',
    nullable: true,
  })
  thumbnailUrl!: string | null;

  @ApiProperty({ example: false })
  requiresPreviousLesson!: boolean;

  @ApiProperty({ example: true })
  allowReplay!: boolean;
}

class AppCurriculumChapterResponseDto {
  @ApiProperty({ example: 'cm123chapter' })
  id!: string;

  @ApiProperty({ example: 'Chương 1: Bảng chữ cái' })
  title!: string;

  @ApiProperty({
    example: 'Làm quen với bảng chữ cái Hàn Quốc',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({ example: 1 })
  order!: number;

  @ApiProperty({ type: [AppCurriculumLessonResponseDto] })
  lessons!: AppCurriculumLessonResponseDto[];
}

export class AppCurriculumResponseDto {
  @ApiProperty({ example: 'cm123curriculum' })
  id!: string;

  @ApiProperty({ example: 'Tiếng Hàn cho người mới bắt đầu' })
  title!: string;

  @ApiProperty({
    example: 'Lộ trình học tiếng Hàn sơ cấp',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({ example: 'cm123level' })
  levelId!: string;

  @ApiProperty({ type: AppCurriculumLevelResponseDto })
  level!: AppCurriculumLevelResponseDto;

  @ApiProperty({ type: [AppCurriculumChapterResponseDto] })
  chapters!: AppCurriculumChapterResponseDto[];
}
