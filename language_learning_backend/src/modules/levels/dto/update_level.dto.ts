import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateLevelDto {
  @ApiPropertyOptional({ example: 'A2', description: 'Tên cấp độ mới' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 2,
    minimum: 1,
    description: 'Thứ tự mới trong ngôn ngữ',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;

  @ApiPropertyOptional({
    example: 'cm123language',
    description: 'ID ngôn ngữ mới',
  })
  @IsOptional()
  @IsString()
  languageId?: string;
}
