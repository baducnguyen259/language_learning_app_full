import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { VocabularyStatus } from '../../../generated/prisma/enums';

export class CreateVocabularyDto {
  @ApiProperty({
    example: '안녕하세요',
    description: 'Từ hoặc cụm từ ngôn ngữ đang học',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  term!: string;

  @ApiPropertyOptional({
    example: 'annyeonghaseyo',
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  pronunciation?: string;

  @ApiProperty({
    example: 'Xin chào',
    description: 'Nghĩa tiếng Việt',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  meaning!: string;

  @ApiPropertyOptional({
    example: 'Thán từ',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  wordType?: string;

  @ApiPropertyOptional({
    example: '/uploads/vocabularies/hello.webp',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: '/uploads/vocabularies/hello.mp3',
  })
  @IsOptional()
  @IsString()
  audioUrl?: string;

  @ApiPropertyOptional({
    enum: VocabularyStatus,
    example: VocabularyStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(VocabularyStatus)
  status?: VocabularyStatus;

  @ApiProperty({
    example: 'cm123lesson',
    description: 'ID bài học chứa từ vựng',
  })
  @IsString()
  @IsNotEmpty()
  lessonId!: string;
}
