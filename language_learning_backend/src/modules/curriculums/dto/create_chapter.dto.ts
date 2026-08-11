import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateChapterDto {
  @ApiProperty({ example: 'Chương 1: Chào hỏi' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: 'Các mẫu câu chào hỏi cơ bản' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  order!: number;
}
