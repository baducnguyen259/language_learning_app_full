import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { QuizStatus } from '../../../generated/prisma/enums';

export class CreateQuizDto {
  @ApiProperty({
    example: 'Bài kiểm tra: Giới thiệu bản thân',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({
    example: 'Ôn tập từ vựng và ngữ pháp giới thiệu bản thân bằng tiếng Hàn.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({
    enum: QuizStatus,
    example: QuizStatus.DRAFT,
    default: QuizStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(QuizStatus)
  status?: QuizStatus;

  @ApiProperty({
    example: 'cm123lesson',
    description: 'ID bài học chứa bài kiểm tra',
  })
  @IsString()
  @IsNotEmpty()
  lessonId!: string;
}
