import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateTopicDto {
  @ApiPropertyOptional({ example: 'Chào hỏi', description: 'Tên chủ đề mới' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name?: string;

  @ApiPropertyOptional({ example: 'cm123level', description: 'ID cấp độ mới' })
  @IsOptional()
  @IsString()
  levelId?: string;
}
