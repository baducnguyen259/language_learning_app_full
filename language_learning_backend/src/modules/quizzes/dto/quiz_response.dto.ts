import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { QuizQuestionType, QuizStatus } from '../../../generated/prisma/enums';

class QuizLanguageResponseDto {
  @ApiProperty({ example: 'cm123language' })
  id!: string;

  @ApiProperty({ example: 'Tiếng Hàn' })
  name!: string;

  @ApiProperty({ example: 'ko' })
  code!: string;
}

class QuizLevelResponseDto {
  @ApiProperty({ example: 'cm123level' })
  id!: string;

  @ApiProperty({ example: 'Sơ cấp 1' })
  name!: string;

  @ApiProperty({ example: 1 })
  order!: number;

  @ApiProperty({ type: QuizLanguageResponseDto })
  language!: QuizLanguageResponseDto;
}

class QuizTopicResponseDto {
  @ApiProperty({
    example: 'cm123topic',
  })
  id!: string;

  @ApiProperty({
    example: 'Giới thiệu bản thân',
  })
  name!: string;

  @ApiProperty({
    type: QuizLevelResponseDto,
  })
  level!: QuizLevelResponseDto;
}

class QuizLessonResponseDto {
  @ApiProperty({
    example: 'cm123lesson',
  })
  id!: string;

  @ApiProperty({
    example: 'Bài 1: 자기소개',
  })
  title!: string;

  @ApiProperty({
    type: QuizTopicResponseDto,
  })
  topic!: QuizTopicResponseDto;
}

export class AdminQuizOptionResponseDto {
  @ApiProperty({
    example: 'cm123option',
  })
  id!: string;

  @ApiProperty({
    example: 'student-ko',
  })
  optionKey!: string;

  @ApiProperty({
    example: '학생',
  })
  text!: string;

  @ApiProperty({
    example: 'student',
    nullable: true,
  })
  pairId!: string | null;

  @ApiProperty({
    example: 1,
  })
  order!: number;

  @ApiProperty({
    example: 'cm123question',
  })
  questionId!: string;
}

export class AdminQuizQuestionResponseDto {
  @ApiProperty({
    example: 'cm123question',
  })
  id!: string;

  @ApiProperty({
    enum: QuizQuestionType,
    example: QuizQuestionType.missingWord,
  })
  type!: QuizQuestionType;

  @ApiProperty({
    example: 1,
  })
  order!: number;

  @ApiProperty({
    example: 'Chọn từ thích hợp điền vào chỗ trống',
  })
  instruction!: string;

  @ApiProperty({
    example: 'Chọn đáp án đúng',
    nullable: true,
  })
  prompt!: string | null;

  @ApiProperty({
    example: '저는 베트남 사람 ________.',
    nullable: true,
  })
  koreanText!: string | null;

  @ApiProperty({
    example: 'Jeoneun Beteunam saram imnida.',
    nullable: true,
  })
  romanization!: string | null;

  @ApiProperty({
    example: 'Tôi là người Việt Nam.',
    nullable: true,
  })
  translation!: string | null;

  @ApiProperty({
    example: '/uploads/quizzes/audio/question-01.mp3',
    nullable: true,
  })
  audioUrl!: string | null;

  @ApiProperty({
    type: [String],
    example: [],
  })
  initialAnswer!: string[];

  @ApiProperty({
    type: [String],
    example: ['입니다'],
  })
  correctAnswer!: string[];

  @ApiProperty({
    example: 'cm123quiz',
  })
  quizId!: string;

  @ApiProperty({
    type: [AdminQuizOptionResponseDto],
  })
  options!: AdminQuizOptionResponseDto[];

  @ApiProperty({
    example: '2026-08-11T10:00:00.000Z',
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-08-11T10:00:00.000Z',
    format: 'date-time',
  })
  updatedAt!: Date;
}

export class QuizResponseDto {
  @ApiProperty({
    example: 'cm123quiz',
  })
  id!: string;

  @ApiProperty({
    example: 'Bài kiểm tra: Giới thiệu bản thân',
  })
  title!: string;

  @ApiProperty({
    example: 'Ôn tập từ vựng và ngữ pháp của bài học.',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    enum: QuizStatus,
    example: QuizStatus.ACTIVE,
  })
  status!: QuizStatus;

  @ApiProperty({
    example: 'cm123lesson',
  })
  lessonId!: string;

  @ApiPropertyOptional({
    type: QuizLessonResponseDto,
  })
  lesson?: QuizLessonResponseDto;

  @ApiPropertyOptional({
    type: [AdminQuizQuestionResponseDto],
  })
  questions?: AdminQuizQuestionResponseDto[];

  @ApiProperty({
    example: '2026-08-11T10:00:00.000Z',
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-08-11T10:00:00.000Z',
    format: 'date-time',
  })
  updatedAt!: Date;
}
export class PublicQuizOptionResponseDto {
  @ApiProperty({
    example: 'missing-imnida',
  })
  id!: string;

  @ApiProperty({
    example: '입니다',
  })
  text!: string;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  pairId!: string | null;

  @ApiProperty({
    example: false,
  })
  isMatched!: boolean;
}

export class PublicQuizQuestionResponseDto {
  @ApiProperty({
    example: 'cm123question',
  })
  id!: string;

  @ApiProperty({
    enum: QuizQuestionType,
    example: QuizQuestionType.missingWord,
  })
  type!: QuizQuestionType;

  @ApiProperty({
    example: 1,
  })
  questionNumber!: number;

  @ApiProperty({
    example: 10,
  })
  totalQuestions!: number;

  @ApiProperty({
    example: 'Chọn từ thích hợp điền vào chỗ trống',
  })
  instruction!: string;

  @ApiProperty({
    example: 'Chọn đáp án đúng',
  })
  prompt!: string;

  @ApiProperty({
    example: '저는 베트남 사람 ________.',
  })
  koreanText!: string;

  @ApiProperty({
    example: 'Jeoneun Beteunam saram imnida.',
  })
  romanization!: string;

  @ApiProperty({
    example: 'Tôi là người Việt Nam.',
  })
  translation!: string;

  @ApiProperty({
    example: '',
  })
  audioUrl!: string;

  @ApiProperty({
    type: [PublicQuizOptionResponseDto],
  })
  options!: PublicQuizOptionResponseDto[];

  @ApiProperty({
    type: [String],
    example: [],
  })
  initialAnswer!: string[];
}

export class PronunciationSegmentResponseDto {
  @ApiProperty({ example: '안녕하세요' })
  text!: string;

  @ApiProperty({ example: 0.92 })
  score!: number;
}

export class QuizAnswerResultResponseDto {
  @ApiProperty({ example: 'cm123question' })
  questionId!: string;

  @ApiProperty({ example: true })
  isCorrect!: boolean;

  @ApiProperty({ example: 1 })
  score!: number;

  @ApiProperty({
    example: 10,
    description: 'XP nhận được từ lần trả lời này',
  })
  experienceEarned!: number;

  @ApiProperty({
    example: 120,
    description: 'Tổng XP hiện tại của người học',
  })
  totalExperience!: number;

  @ApiProperty({
    type: [String],
    example: ['입니다'],
  })
  userAnswer!: string[];

  @ApiProperty({
    type: [String],
    example: ['입니다'],
  })
  correctAnswer!: string[];

  @ApiProperty({ example: 'Chính xác!' })
  feedback!: string;

  @ApiProperty({
    type: [PronunciationSegmentResponseDto],
    example: [],
  })
  pronunciationSegments!: PronunciationSegmentResponseDto[];
}
export class PracticeQuestionQueueResponseDto {
  @ApiProperty({
    enum: QuizQuestionType,
    example: QuizQuestionType.matching,
  })
  type!: QuizQuestionType;

  @ApiProperty({
    type: PublicQuizQuestionResponseDto,
    isArray: true,
  })
  items!: PublicQuizQuestionResponseDto[];

  @ApiProperty({
    example: 25,
    description: 'Tổng số câu hỏi có thể luyện tập',
  })
  totalAvailable!: number;

  @ApiProperty({
    example: 10,
    description: 'Số câu hỏi tối đa được yêu cầu',
  })
  limit!: number;
}
export class PracticeModeOverviewResponseDto {
  @ApiProperty({
    enum: QuizQuestionType,
    example: QuizQuestionType.listeningInput,
  })
  type!: QuizQuestionType;

  @ApiProperty({
    example: 15,
  })
  availableQuestions!: number;

  @ApiProperty({
    example: true,
  })
  isAvailable!: boolean;
}

export class PracticeOverviewResponseDto {
  @ApiProperty({
    example: 12,
    description: 'Số từ được đưa vào phiên ôn nhanh',
  })
  quickReviewCount!: number;

  @ApiProperty({
    example: 45,
    description: 'Tổng số từ có thể ôn tập',
  })
  totalVocabularyAvailable!: number;

  @ApiProperty({
    type: PracticeModeOverviewResponseDto,
    isArray: true,
  })
  modes!: PracticeModeOverviewResponseDto[];
}
