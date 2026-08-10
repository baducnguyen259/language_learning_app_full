import { ApiProperty } from '@nestjs/swagger';
import {
  UserRole,
  UserStatus,
} from '../../../generated/prisma/enums';

export class UserResponseDto {
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

  @ApiProperty({ example: '2026-08-10T10:00:00.000Z', format: 'date-time' })
  updatedAt!: Date;
}
