import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email quản trị viên',
  })
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiProperty({
    example: 'Admin@123456',
    minLength: 8,
    description: 'Mật khẩu quản trị viên',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}
