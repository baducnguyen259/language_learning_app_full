import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { VocabularyStatus } from '../../../generated/prisma/enums';

export class UpdateVocabularyDto {
  @ApiPropertyOptional({
    example: '안녕하세요',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  term?: string;

  @ApiPropertyOptional({
    example: 'annyeonghaseyo',
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  pronunciation?: string;

  @ApiPropertyOptional({
    example: 'Xin chào',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  meaning?: string;

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
    example: VocabularyStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(VocabularyStatus)
  status?: VocabularyStatus;

  @ApiPropertyOptional({
    example: 'cm123lesson',
  })
  @IsOptional()
  @IsString()
  lessonId?: string;
}
