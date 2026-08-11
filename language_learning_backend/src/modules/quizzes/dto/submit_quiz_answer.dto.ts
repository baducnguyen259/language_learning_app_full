import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  MaxLength,
} from 'class-validator';

export class SubmitQuizAnswerDto {
  @ApiProperty({
    type: [String],
    example: ['입니다'],
    description: 'Đáp án người học đã chọn hoặc nhập',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(2000, { each: true })
  userAnswer!: string[];
}
