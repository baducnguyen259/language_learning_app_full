import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../generated/prisma/enums';

class AdminLoginUserDto {
  @ApiProperty({
    example: 'cm123user',
  })
  id!: string;

  @ApiProperty({
    example: 'Administrator',
  })
  name!: string;

  @ApiProperty({
    example: 'admin@example.com',
  })
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
    description: 'JWT access token',
  })
  accessToken!: string;

  @ApiProperty({
    type: AdminLoginUserDto,
  })
  user!: AdminLoginUserDto;
}

export class CurrentAdminResponseDto {
  @ApiProperty({
    example: 'cm123user',
  })
  id!: string;

  @ApiProperty({
    example: 'admin@example.com',
  })
  email!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  role!: UserRole;
}