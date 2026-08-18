import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VocabularyStatus } from '../../../generated/prisma/enums';

class VocabularyLanguageDto {
  @ApiProperty({ example: 'cm123language' })
  id!: string;

  @ApiProperty({ example: 'Tiếng Hàn' })
  name!: string;

  @ApiProperty({ example: 'ko' })
  code!: string;
}

class VocabularyLevelDto {
  @ApiProperty({ example: 'cm123level' })
  id!: string;

  @ApiProperty({ example: 'A1' })
  name!: string;

  @ApiProperty({ type: VocabularyLanguageDto })
  language!: VocabularyLanguageDto;
}

class VocabularyTopicDto {
  @ApiProperty({ example: 'cm123topic' })
  id!: string;

  @ApiProperty({ example: 'Chào hỏi' })
  name!: string;

  @ApiProperty({ type: VocabularyLevelDto })
  level!: VocabularyLevelDto;
}

class VocabularyLessonDto {
  @ApiProperty({ example: 'cm123lesson' })
  id!: string;

  @ApiProperty({ example: 'Bài 1: Xin chào' })
  title!: string;

  @ApiProperty({ type: VocabularyTopicDto })
  topic!: VocabularyTopicDto;
}

export class VocabularyResponseDto {
  @ApiProperty({ example: 'cm123vocabulary' })
  id!: string;

  @ApiProperty({ example: '안녕하세요' })
  term!: string;

  @ApiProperty({ example: 'annyeonghaseyo', nullable: true })
  pronunciation!: string | null;

  @ApiProperty({ example: 'Xin chào' })
  meaning!: string;

  @ApiProperty({ example: 'Thán từ', nullable: true })
  wordType!: string | null;

  @ApiProperty({ example: '/uploads/vocabularies/hello.webp', nullable: true })
  imageUrl!: string | null;

  @ApiProperty({ example: '/uploads/vocabularies/hello.mp3', nullable: true })
  audioUrl!: string | null;

  @ApiProperty({ enum: VocabularyStatus, example: VocabularyStatus.ACTIVE })
  status!: VocabularyStatus;

  @ApiProperty({ example: 'cm123lesson' })
  lessonId!: string;

  @ApiPropertyOptional({ type: VocabularyLessonDto })
  lesson?: VocabularyLessonDto;

  @ApiProperty({ example: '2026-08-10T10:00:00.000Z', format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-10T10:00:00.000Z', format: 'date-time' })
  updatedAt!: Date;
}

export class BulkDeleteVocabularyResponseDto {
  @ApiProperty({ example: 2 })
  deletedCount!: number;
}
