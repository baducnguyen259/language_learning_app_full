import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLanguageDto {
  @ApiProperty({
    example: 'Tiếng Anh',
    description: 'Tên hiển thị của ngôn ngữ',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 'en',
    description: 'Mã ngôn ngữ gồm 2 đến 10 chữ cái',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]{2,10}$/)
  code!: string;
}
