import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class AppCurriculumQueryDto {
  @ApiPropertyOptional({
    example: 'ko',
    description: 'Mã ngôn ngữ',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  languageCode?: string;

  @ApiPropertyOptional({
    example: 'cm123level',
    description: 'ID cấp độ',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  levelId?: string;
}
