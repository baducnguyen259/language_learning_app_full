import { ApiProperty } from '@nestjs/swagger';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Nguyễn Văn An',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 'user@example.com',
  })
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiProperty({
    example: 'Korean123',
    minLength: 9,
    maxLength: 16,
    description: 'Mật khẩu phải có chữ hoa, chữ thường và chữ số',
  })
  @IsString()
  @MinLength(9)
  @MaxLength(16)
  @Matches(/[a-z]/, {
    message: 'Mật khẩu phải có ít nhất một chữ thường',
  })
  @Matches(/[A-Z]/, {
    message: 'Mật khẩu phải có ít nhất một chữ hoa',
  })
  @Matches(/[0-9]/, {
    message: 'Mật khẩu phải có ít nhất một chữ số',
  })
  password!: string;

  @ApiProperty({
    example: 'Korean123',
  })
  @IsString()
  @MinLength(9)
  @MaxLength(16)
  confirmPassword!: string;

  @ApiProperty({
    example: true,
    description: 'Người dùng đã đồng ý điều khoản và chính sách bảo mật',
  })
  @IsBoolean()
  @Equals(true, {
    message: 'Bạn phải đồng ý điều khoản và chính sách bảo mật',
  })
  acceptTerms!: boolean;
}
