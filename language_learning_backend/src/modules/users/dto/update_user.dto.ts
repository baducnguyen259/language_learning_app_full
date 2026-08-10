import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../generated/prisma/enums';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn An', description: 'Tên người dùng' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.USER, description: 'Quyền tài khoản' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
