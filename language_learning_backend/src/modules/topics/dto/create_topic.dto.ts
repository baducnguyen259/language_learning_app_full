import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty({ example: 'Gia đình', description: 'Tên chủ đề' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  name!: string;

  @ApiProperty({ example: 'cm123level', description: 'ID cấp độ sở hữu chủ đề' })
  @IsString()
  @IsNotEmpty()
  levelId!: string;
}
