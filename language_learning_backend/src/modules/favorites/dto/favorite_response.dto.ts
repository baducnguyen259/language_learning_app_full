import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class FavoriteLanguageResponseDto {
  @ApiProperty({ example: 'cm123language' })
  id!: string;

  @ApiProperty({ example: 'Tiếng Hàn' })
  name!: string;

  @ApiProperty({ example: 'ko' })
  code!: string;
}

class FavoriteLevelResponseDto {
  @ApiProperty({ example: 'cm123level' })
  id!: string;

  @ApiProperty({ example: 'Sơ cấp 1' })
  name!: string;

  @ApiProperty({ example: 1 })
  order!: number;

  @ApiProperty({ type: FavoriteLanguageResponseDto })
  language!: FavoriteLanguageResponseDto;
}

class FavoriteTopicResponseDto {
  @ApiProperty({ example: 'cm123topic' })
  id!: string;

  @ApiProperty({ example: 'Chào hỏi' })
  name!: string;

  @ApiProperty({ type: FavoriteLevelResponseDto })
  level!: FavoriteLevelResponseDto;
}

class FavoriteLessonResponseDto {
  @ApiProperty({ example: 'cm123lesson' })
  id!: string;

  @ApiProperty({ example: 'Bài 1: Xin chào' })
  title!: string;

  @ApiProperty({ type: FavoriteTopicResponseDto })
  topic!: FavoriteTopicResponseDto;
}

class FavoriteVocabularyResponseDto {
  @ApiProperty({ example: 'cm123vocabulary' })
  id!: string;

  @ApiProperty({ example: '안녕하세요' })
  term!: string;

  @ApiPropertyOptional({
    example: 'annyeonghaseyo',
    nullable: true,
  })
  pronunciation!: string | null;

  @ApiProperty({ example: 'Xin chào' })
  meaning!: string;

  @ApiPropertyOptional({
    example: 'Thán từ',
    nullable: true,
  })
  wordType!: string | null;

  @ApiPropertyOptional({
    nullable: true,
  })
  imageUrl!: string | null;

  @ApiPropertyOptional({
    nullable: true,
  })
  audioUrl!: string | null;

  @ApiProperty({ example: 'cm123lesson' })
  lessonId!: string;

  @ApiProperty({ type: FavoriteLessonResponseDto })
  lesson!: FavoriteLessonResponseDto;
}

export class VocabularyFavoriteResponseDto {
  @ApiProperty({ example: 'cm123favorite' })
  id!: string;

  @ApiProperty({ example: 'cm123vocabulary' })
  vocabularyId!: string;

  @ApiProperty({ example: true })
  isFavorite!: true;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: FavoriteVocabularyResponseDto })
  vocabulary!: FavoriteVocabularyResponseDto;
}

export class VocabularyFavoriteStatusResponseDto {
  @ApiProperty({ example: 'cm123vocabulary' })
  vocabularyId!: string;

  @ApiProperty({ example: false })
  isFavorite!: boolean;
}
