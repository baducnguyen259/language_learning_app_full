import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { QuizQuestionType } from '../../../generated/prisma/enums';

export class CreateQuizOptionDto {
  @ApiProperty({
    example: 'student-ko',
    description: 'Mã lựa chọn, không trùng trong cùng câu hỏi',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  optionKey!: string;

  @ApiProperty({
    example: '학생',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  text!: string;

  @ApiPropertyOptional({
    example: 'student',
    description: 'Mã ghép cặp, chỉ dùng cho câu hỏi matching',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  pairId?: string;

  @ApiProperty({
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  order!: number;
}

export class CreateQuizQuestionDto {
  @ApiProperty({
    enum: QuizQuestionType,
    example: QuizQuestionType.missingWord,
  })
  @IsEnum(QuizQuestionType)
  type!: QuizQuestionType;

  @ApiProperty({
    example: 1,
    minimum: 1,
    description: 'Thứ tự câu hỏi trong Quiz',
  })
  @IsInt()
  @Min(1)
  order!: number;

  @ApiProperty({
    example: 'Chọn từ thích hợp điền vào chỗ trống',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  instruction!: string;

  @ApiPropertyOptional({
    example: 'Chọn đáp án đúng',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  prompt?: string;

  @ApiPropertyOptional({
    example: '저는 베트남 사람 ________.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  koreanText?: string;

  @ApiPropertyOptional({
    example: 'Jeoneun Beteunam saram imnida.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  romanization?: string;

  @ApiPropertyOptional({
    example: 'Tôi là người Việt Nam.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  translation?: string;

  @ApiPropertyOptional({
    example: '/uploads/quizzes/audio/question-01.mp3',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  audioUrl?: string;

  @ApiPropertyOptional({
    type: [String],
    example: [],
    description: 'Đáp án được điền sẵn khi bắt đầu câu hỏi',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  initialAnswer?: string[];

  @ApiProperty({
    type: [String],
    example: ['입니다'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsString({ each: true })
  correctAnswer!: string[];

  @ApiPropertyOptional({
    type: [CreateQuizOptionDto],
    example: [
      {
        optionKey: 'missing-imnida',
        text: '입니다',
        order: 1,
      },
      {
        optionKey: 'missing-isseoyo',
        text: '있어요',
        order: 2,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CreateQuizOptionDto)
  options?: CreateQuizOptionDto[];
}
