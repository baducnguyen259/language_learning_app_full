import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DashboardUserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional({
    nullable: true,
  })
  avatarUrl!: string | null;
}

export class DashboardCurriculumResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;
}

export class DashboardChapterResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({
    type: DashboardCurriculumResponseDto,
  })
  curriculum!: DashboardCurriculumResponseDto;
}

export class DashboardCurrentLessonResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional({
    nullable: true,
  })
  durationMinutes!: number | null;

  @ApiPropertyOptional({
    nullable: true,
  })
  thumbnailUrl!: string | null;

  @ApiProperty({
    minimum: 0,
    maximum: 100,
  })
  progressPercent!: number;

  @ApiPropertyOptional({
    type: DashboardChapterResponseDto,
    nullable: true,
  })
  chapter!: DashboardChapterResponseDto | null;
}

export class UserDashboardResponseDto {
  @ApiProperty({
    type: DashboardUserResponseDto,
  })
  user!: DashboardUserResponseDto;

  @ApiProperty()
  learningStreak!: number;

  @ApiProperty()
  totalExperience!: number;

  @ApiProperty()
  completedLessons!: number;

  @ApiProperty()
  dailyGoalMinutes!: number;

  @ApiProperty()
  completedMinutesToday!: number;

  @ApiProperty({
    minimum: 0,
    maximum: 100,
  })
  dailyGoalProgress!: number;

  @ApiPropertyOptional({
    type: DashboardCurrentLessonResponseDto,
    nullable: true,
  })
  currentLesson!: DashboardCurrentLessonResponseDto | null;
}

export class DailyGoalResponseDto {
  @ApiProperty()
  dailyGoalMinutes!: number;

  @ApiProperty()
  timezone!: string;
}
