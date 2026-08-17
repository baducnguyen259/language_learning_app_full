import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UserRole } from '../../../../generated/prisma/enums';

export class UserProfileResponseDto {
  @ApiProperty({ example: 'cm123user' })
  id!: string;

  @ApiProperty({ example: 'Nguyễn Văn An' })
  name!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
  })
  role!: UserRole;

  @ApiPropertyOptional({
    example: 'https://lh3.googleusercontent.com/a/...',
    nullable: true,
  })
  avatarUrl!: string | null;
}

export class UserAuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIs...',
    description: 'JWT access token của người học',
  })
  accessToken!: string;
  @ApiProperty({ description: 'Token dùng để lấy access token mới' })
  refreshToken!: string;
  @ApiProperty({ type: UserProfileResponseDto })
  user!: UserProfileResponseDto;
}

export class CurrentUserResponseDto {
  @ApiProperty({ example: 'cm123user' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
  })
  role!: UserRole;
}
