import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateLanguageDto {
  @ApiPropertyOptional({
    example: 'Tiếng Anh',
    description: 'Tên hiển thị mới',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'en',
    description: 'Mã ngôn ngữ gồm 2 đến 10 chữ cái',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z]{2,10}$/, {
    message: 'code chỉ được chứa từ 2 đến 10 chữ cái',
  })
  code?: string;
}
