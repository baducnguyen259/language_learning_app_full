import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class MyProfileLanguageResponseDto {
  @ApiProperty({ example: 'cm123language' })
  id!: string;

  @ApiProperty({ example: 'Tiếng Hàn' })
  name!: string;

  @ApiProperty({ example: 'ko' })
  code!: string;
}

class MyProfileLevelResponseDto {
  @ApiProperty({ example: 'cm123level' })
  id!: string;

  @ApiProperty({ example: 'Sơ cấp 1' })
  name!: string;

  @ApiProperty({ example: 1 })
  order!: number;
}

export class MyProfileResponseDto {
  @ApiProperty({ example: 'cm123user' })
  id!: string;

  @ApiProperty({ example: 'Nguyễn Bá Đức' })
  name!: string;

  @ApiPropertyOptional({ nullable: true, example: 'Đức' })
  displayName!: string | null;

  @ApiProperty({ example: 'duc@example.com' })
  email!: string;

  @ApiPropertyOptional({
    nullable: true,
    example: 'https://lh3.googleusercontent.com/a/...',
  })
  avatarUrl!: string | null;

  @ApiPropertyOptional({ nullable: true, example: '0912345678' })
  phoneNumber!: string | null;

  @ApiPropertyOptional({ nullable: true, format: 'date-time' })
  dateOfBirth!: Date | null;

  @ApiPropertyOptional({ nullable: true, enum: ['MALE', 'FEMALE', 'OTHER'] })
  gender!: string | null;

  @ApiPropertyOptional({ nullable: true, format: 'date-time' })
  profileCompletedAt!: Date | null;

  @ApiProperty({ example: false })
  requiresProfileSetup!: boolean;

  @ApiProperty({
    example: 15,
  })
  dailyGoalMinutes!: number;

  @ApiProperty({
    example: 120,
  })
  totalExperience!: number;

  @ApiProperty({
    example: 'Asia/Ho_Chi_Minh',
  })
  timezone!: string;

  @ApiPropertyOptional({
    type: MyProfileLanguageResponseDto,
    nullable: true,
  })
  currentLanguage!: MyProfileLanguageResponseDto | null;

  @ApiPropertyOptional({
    type: MyProfileLevelResponseDto,
    nullable: true,
  })
  currentLevel!: MyProfileLevelResponseDto | null;

  @ApiProperty({
    format: 'date-time',
  })
  createdAt!: Date;
}
