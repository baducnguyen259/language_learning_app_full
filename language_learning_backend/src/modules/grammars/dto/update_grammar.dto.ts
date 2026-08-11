import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { GrammarStatus } from '../../../generated/prisma/enums';

export class UpdateGrammarDto {
  @ApiPropertyOptional({
    example: 'Đuôi câu 이에요/예요',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    example: 'N + 이에요/예요',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  pattern?: string;

  @ApiPropertyOptional({
    example:
      'Dùng để giới thiệu danh tính, nghề nghiệp hoặc định nghĩa một sự vật.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  explanation?: string;

  @ApiPropertyOptional({
    example: '이것은 책이에요.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  example?: string;

  @ApiPropertyOptional({
    example: 'Đây là quyển sách.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  exampleMeaning?: string;

  @ApiPropertyOptional({
    example: '책 có phụ âm cuối nên sử dụng 이에요.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;

  @ApiPropertyOptional({
    example: 2,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;

  @ApiPropertyOptional({
    enum: GrammarStatus,
    example: GrammarStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(GrammarStatus)
  status?: GrammarStatus;

  @ApiPropertyOptional({
    example: 'cm123lesson',
  })
  @IsOptional()
  @IsString()
  lessonId?: string;
}
