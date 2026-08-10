import { ApiProperty } from '@nestjs/swagger';
import {
  LessonStatus,
  UserRole,
  UserStatus,
} from '../../../generated/prisma/enums';

class DashboardOverviewDto {
  @ApiProperty({ example: 100 })
  totalUsers!: number;

  @ApiProperty({ example: 92 })
  activeAccounts!: number;

  @ApiProperty({ example: 3 })
  totalLanguages!: number;

  @ApiProperty({ example: 12 })
  totalLevels!: number;

  @ApiProperty({ example: 45 })
  totalTopics!: number;

  @ApiProperty({ example: 128 })
  totalLessons!: number;
}

class DashboardLessonStatusDto {
  @ApiProperty({ example: 20 })
  draft!: number;

  @ApiProperty({ example: 6 })
  scheduled!: number;

  @ApiProperty({ example: 102 })
  published!: number;
}

class DashboardRecentUserDto {
  @ApiProperty({ example: 'cm123user' })
  id!: string;

  @ApiProperty({ example: 'Nguyễn Văn An' })
  name!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role!: UserRole;

  @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE })
  status!: UserStatus;

  @ApiProperty({ example: '2026-08-10T10:00:00.000Z', format: 'date-time' })
  createdAt!: Date;
}

class DashboardLanguageDto {
  @ApiProperty({ example: 'cm123language' })
  id!: string;

  @ApiProperty({ example: 'Tiếng Anh' })
  name!: string;

  @ApiProperty({ example: 'en' })
  code!: string;
}

class DashboardLevelDto {
  @ApiProperty({ example: 'cm123level' })
  id!: string;

  @ApiProperty({ example: 'A1' })
  name!: string;

  @ApiProperty({ type: DashboardLanguageDto })
  language!: DashboardLanguageDto;
}

class DashboardTopicDto {
  @ApiProperty({ example: 'cm123topic' })
  id!: string;

  @ApiProperty({ example: 'Chào hỏi' })
  name!: string;

  @ApiProperty({ type: DashboardLevelDto })
  level!: DashboardLevelDto;
}

class DashboardRecentLessonDto {
  @ApiProperty({ example: 'cm123lesson' })
  id!: string;

  @ApiProperty({ example: 'Bài 1: Xin chào' })
  title!: string;

  @ApiProperty({ enum: LessonStatus, example: LessonStatus.PUBLISHED })
  status!: LessonStatus;

  @ApiProperty({ example: '2026-08-10T10:00:00.000Z', format: 'date-time' })
  updatedAt!: Date;

  @ApiProperty({ type: DashboardTopicDto })
  topic!: DashboardTopicDto;
}

export class DashboardResponseDto {
  @ApiProperty({ type: DashboardOverviewDto })
  overview!: DashboardOverviewDto;

  @ApiProperty({ type: DashboardLessonStatusDto })
  lessonStatus!: DashboardLessonStatusDto;

  @ApiProperty({ type: [DashboardRecentUserDto] })
  recentUsers!: DashboardRecentUserDto[];

  @ApiProperty({ type: [DashboardRecentLessonDto] })
  recentLessons!: DashboardRecentLessonDto[];
}
