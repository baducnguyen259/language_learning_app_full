import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class FinishStudySessionDto {
  @ApiProperty({
    example: 900,
    description: 'Thời gian thực học tính bằng giây',
    minimum: 1,
    maximum: 14400,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(14400)
  durationSeconds!: number;
}
