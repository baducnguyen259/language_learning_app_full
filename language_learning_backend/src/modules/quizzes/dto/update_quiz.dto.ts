import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { QuizStatus } from '../../../generated/prisma/enums';

export class UpdateQuizDto {
  @ApiPropertyOptional({
    example: 'Bài kiểm tra: Giới thiệu bản thân',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    example: 'Ôn tập kiến thức tiếng Hàn của bài giới thiệu bản thân.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({
    enum: QuizStatus,
    example: QuizStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(QuizStatus)
  status?: QuizStatus;

  @ApiPropertyOptional({
    example: 'cm123lesson',
  })
  @IsOptional()
  @IsString()
  lessonId?: string;
}
