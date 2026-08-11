import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CurriculumStatus } from '../../../generated/prisma/enums';

export class CreateCurriculumDto {
  @ApiProperty({
    example: 'Tiếng Hàn cơ bản',
    description: 'Tên lộ trình học',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({
    example: 'Lộ trình dành cho người mới bắt đầu',
    description: 'Mô tả lộ trình',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({
    enum: CurriculumStatus,
    example: CurriculumStatus.DRAFT,
    default: CurriculumStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(CurriculumStatus)
  status?: CurriculumStatus;

  @ApiProperty({
    example: 'cm123level',
    description: 'ID cấp độ của lộ trình',
  })
  @IsString()
  @IsNotEmpty()
  levelId!: string;
}
