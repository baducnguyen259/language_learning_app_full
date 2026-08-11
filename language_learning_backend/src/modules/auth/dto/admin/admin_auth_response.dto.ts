import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../../../../generated/prisma/enums';

class AdminProfileResponseDto {
  @ApiProperty({ example: 'cm123admin' })
  id!: string;

  @ApiProperty({ example: 'Administrator' })
  name!: string;

  @ApiProperty({ example: 'admin@example.com' })
  email!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  role!: UserRole;
}

export class AdminLoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIs...',
    description: 'JWT access token của admin',
  })
  accessToken!: string;

  @ApiProperty({ type: AdminProfileResponseDto })
  user!: AdminProfileResponseDto;
}

export class CurrentAdminResponseDto {
  @ApiProperty({ example: 'cm123admin' })
  id!: string;

  @ApiProperty({ example: 'admin@example.com' })
  email!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  role!: UserRole;
}
