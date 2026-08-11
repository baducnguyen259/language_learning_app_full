import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { GrammarStatus } from '../../../generated/prisma/enums';

export class CreateGrammarDto {
  @ApiProperty({
    example: 'Đuôi câu 이에요/예요',
    description: 'Tên điểm ngữ pháp tiếng Hàn',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @ApiProperty({
    example: 'N + 이에요/예요',
    description: 'Cấu trúc ngữ pháp tiếng Hàn',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  pattern!: string;

  @ApiProperty({
    example:
      'Dùng để diễn đạt “là...”. 이에요 dùng sau danh từ có phụ âm cuối, 예요 dùng sau danh từ không có phụ âm cuối.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(5000)
  explanation!: string;

  @ApiPropertyOptional({
    example: '저는 학생이에요.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  example?: string;

  @ApiPropertyOptional({
    example: 'Tôi là học sinh.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  exampleMeaning?: string;

  @ApiPropertyOptional({
    example: '학생 có phụ âm cuối nên sử dụng 이에요.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;

  @ApiProperty({
    example: 1,
    minimum: 1,
    description: 'Thứ tự điểm ngữ pháp trong bài học',
  })
  @IsInt()
  @Min(1)
  order!: number;

  @ApiPropertyOptional({
    enum: GrammarStatus,
    example: GrammarStatus.DRAFT,
    default: GrammarStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(GrammarStatus)
  status?: GrammarStatus;

  @ApiProperty({
    example: 'cm123lesson',
    description: 'ID bài học chứa điểm ngữ pháp',
  })
  @IsString()
  @IsNotEmpty()
  lessonId!: string;
}
