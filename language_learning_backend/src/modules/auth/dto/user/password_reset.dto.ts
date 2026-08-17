import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @MaxLength(255)
  email!: string;
}

export class VerifyPasswordResetOtpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: '123456', description: 'Mã OTP gồm đúng 6 chữ số' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'OTP phải gồm đúng 6 chữ số' })
  otp!: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Reset token nhận được sau khi xác minh OTP' })
  @IsString()
  @MinLength(40)
  @MaxLength(500)
  resetToken!: string;

  @ApiProperty({
    example: 'Korean456',
    minLength: 9,
    maxLength: 16,
    writeOnly: true,
  })
  @IsString()
  @MinLength(9)
  @MaxLength(16)
  @Matches(/[a-z]/, { message: 'Mật khẩu phải có ít nhất một chữ thường' })
  @Matches(/[A-Z]/, { message: 'Mật khẩu phải có ít nhất một chữ hoa' })
  @Matches(/[0-9]/, { message: 'Mật khẩu phải có ít nhất một chữ số' })
  newPassword!: string;

  @ApiProperty({ example: 'Korean456', writeOnly: true })
  @IsString()
  @MinLength(9)
  @MaxLength(16)
  confirmNewPassword!: string;
}

export class PasswordResetMessageResponseDto {
  @ApiProperty({ example: 'Nếu email tồn tại, mã OTP đã được gửi' })
  message!: string;
}

export class VerifyPasswordResetOtpResponseDto {
  @ApiProperty({ description: 'Token dùng một lần để đặt mật khẩu mới' })
  resetToken!: string;
}
