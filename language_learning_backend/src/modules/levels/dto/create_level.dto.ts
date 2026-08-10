import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateLevelDto {
  @ApiProperty({ example: 'A1', description: 'Tên cấp độ' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 1, minimum: 1, description: 'Thứ tự cấp độ trong ngôn ngữ' })
  @IsInt()
  @Min(1)
  order!: number;

  @ApiProperty({ example: 'cm123language', description: 'ID ngôn ngữ sở hữu cấp độ' })
  @IsString()
  @IsNotEmpty()
  languageId!: string;
}
