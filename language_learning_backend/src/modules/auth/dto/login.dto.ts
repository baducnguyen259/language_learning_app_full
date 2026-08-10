import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email quản trị viên',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Admin@123456',
    minLength: 8,
    description: 'Mật khẩu quản trị viên',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
