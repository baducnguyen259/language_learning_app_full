import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength } from 'class-validator';

export class VerifyEmailOtpDto {
  @ApiProperty({
    example: 'user@example.com',
  })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP gồm đúng 6 chữ số',
  })
  @IsString()
  @Matches(/^\d{6}$/, {
    message: 'OTP phải gồm đúng 6 chữ số',
  })
  otp!: string;
}

export class ResendEmailVerificationDto {
  @ApiProperty({
    example: 'user@example.com',
  })
  @IsEmail()
  @MaxLength(255)
  email!: string;
}

export class EmailVerificationMessageResponseDto {
  @ApiProperty({
    example: 'Nếu tài khoản cần xác minh, mã OTP đã được gửi',
  })
  message!: string;
}
