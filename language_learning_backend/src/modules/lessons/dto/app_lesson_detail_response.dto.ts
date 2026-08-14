import { ApiProperty } from '@nestjs/swagger';

class AppLessonLanguageResponseDto {
  @ApiProperty({ example: 'cm123language' })
  id!: string;

  @ApiProperty({ example: 'Tiếng Hàn' })
  name!: string;

  @ApiProperty({ example: 'ko' })
  code!: string;
}

class AppLessonLevelResponseDto {
  @ApiProperty({ example: 'cm123level' })
  id!: string;

  @ApiProperty({ example: 'Sơ cấp 1' })
  name!: string;

  @ApiProperty({ example: 1 })
  order!: number;

  @ApiProperty({ type: AppLessonLanguageResponseDto })
  language!: AppLessonLanguageResponseDto;
}

class AppLessonTopicResponseDto {
  @ApiProperty({ example: 'cm123topic' })
  id!: string;

  @ApiProperty({ example: 'Chào hỏi' })
  name!: string;

  @ApiProperty({ type: AppLessonLevelResponseDto })
  level!: AppLessonLevelResponseDto;
}

class AppLessonChapterResponseDto {
  @ApiProperty({ example: 'cm123chapter' })
  id!: string;

  @ApiProperty({ example: 'Chương 1: Chào hỏi' })
  title!: string;

  @ApiProperty({ example: 1 })
  order!: number;

  @ApiProperty({ example: 'cm123curriculum' })
  curriculumId!: string;
}

class AppLessonVocabularyResponseDto {
  @ApiProperty({ example: 'cm123vocabulary' })
  id!: string;

  @ApiProperty({ example: '안녕하세요' })
  term!: string;

  @ApiProperty({ example: 'annyeonghaseyo', nullable: true })
  pronunciation!: string | null;

  @ApiProperty({ example: 'Xin chào' })
  meaning!: string;

  @ApiProperty({ example: 'Cụm từ', nullable: true })
  wordType!: string | null;

  @ApiProperty({
    example: '/uploads/vocabularies/hello.webp',
    nullable: true,
  })
  imageUrl!: string | null;

  @ApiProperty({
    example: '/uploads/vocabularies/hello.mp3',
    nullable: true,
  })
  audioUrl!: string | null;
}

class AppLessonGrammarResponseDto {
  @ApiProperty({ example: 'cm123grammar' })
  id!: string;

  @ApiProperty({ example: 'Câu chào hỏi trang trọng' })
  title!: string;

  @ApiProperty({ example: '안녕하세요' })
  pattern!: string;

  @ApiProperty({
    example: 'Dùng khi chào hỏi người lớn tuổi hoặc người mới gặp',
  })
  explanation!: string;

  @ApiProperty({ example: '선생님, 안녕하세요?', nullable: true })
  example!: string | null;

  @ApiProperty({ example: 'Em chào thầy ạ?', nullable: true })
  exampleMeaning!: string | null;

  @ApiProperty({ example: 'Dùng trong hoàn cảnh lịch sự', nullable: true })
  note!: string | null;

  @ApiProperty({ example: 1 })
  order!: number;
}

class AppLessonQuizResponseDto {
  @ApiProperty({ example: 'cm123quiz' })
  id!: string;

  @ApiProperty({ example: 'Luyện tập bài chào hỏi' })
  title!: string;

  @ApiProperty({
    example: 'Kiểm tra nội dung bài học',
    nullable: true,
  })
  description!: string | null;
}

export class AppLessonDetailResponseDto {
  @ApiProperty({ example: 'cm123lesson' })
  id!: string;

  @ApiProperty({ example: 'Bài 1: Xin chào' })
  title!: string;

  @ApiProperty({
    example: 'Học cách chào hỏi bằng tiếng Hàn',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({ example: 'cm123topic' })
  topicId!: string;

  @ApiProperty({ type: AppLessonTopicResponseDto })
  topic!: AppLessonTopicResponseDto;

  @ApiProperty({ example: 'cm123chapter', nullable: true })
  chapterId!: string | null;

  @ApiProperty({ example: 1, nullable: true })
  orderInChapter!: number | null;

  @ApiProperty({
    type: AppLessonChapterResponseDto,
    nullable: true,
  })
  chapter!: AppLessonChapterResponseDto | null;

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

  @ApiProperty({ type: [AppLessonVocabularyResponseDto] })
  vocabularies!: AppLessonVocabularyResponseDto[];

  @ApiProperty({ type: [AppLessonGrammarResponseDto] })
  grammars!: AppLessonGrammarResponseDto[];

  @ApiProperty({
    type: AppLessonQuizResponseDto,
    nullable: true,
  })
  quiz!: AppLessonQuizResponseDto | null;
}
