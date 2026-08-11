import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CurriculumStatus } from '../../../generated/prisma/enums';

export class UpdateCurriculumDto {
  @ApiPropertyOptional({ example: 'Tiếng Hàn sơ cấp' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: 'Lộ trình dành cho người mới bắt đầu' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({
    enum: CurriculumStatus,
    example: CurriculumStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(CurriculumStatus)
  status?: CurriculumStatus;

  @ApiPropertyOptional({ example: 'cm123level' })
  @IsOptional()
  @IsString()
  levelId?: string;
}
