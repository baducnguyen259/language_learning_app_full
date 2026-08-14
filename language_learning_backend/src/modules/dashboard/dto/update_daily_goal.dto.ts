import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class UpdateDailyGoalDto {
  @ApiProperty({
    example: 15,
    minimum: 5,
    maximum: 180,
  })
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(180)
  dailyGoalMinutes!: number;
}
