import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class AssignLessonDto {
  @ApiProperty({ example: 'cm123lesson' })
  @IsString()
  @IsNotEmpty()
  lessonId!: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  orderInChapter!: number;
}
