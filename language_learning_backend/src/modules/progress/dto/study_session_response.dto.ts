import { ApiProperty } from '@nestjs/swagger';

class StudySessionLessonResponseDto {
  @ApiProperty({ example: 'cm123lesson' })
  id!: string;

  @ApiProperty({ example: 'Bài 1: Xin chào' })
  title!: string;
}

export class StudySessionResponseDto {
  @ApiProperty({ example: 'cm123session' })
  id!: string;

  @ApiProperty({ example: 'cm123lesson' })
  lessonId!: string;

  @ApiProperty({ type: StudySessionLessonResponseDto })
  lesson!: StudySessionLessonResponseDto;

  @ApiProperty({
    example: '2026-08-14T03:00:00.000Z',
    format: 'date-time',
  })
  startedAt!: Date;

  @ApiProperty({
    example: null,
    format: 'date-time',
    nullable: true,
  })
  endedAt!: Date | null;

  @ApiProperty({ example: 900 })
  durationSeconds!: number;

  @ApiProperty({ example: 0 })
  experienceEarned!: number;
}
