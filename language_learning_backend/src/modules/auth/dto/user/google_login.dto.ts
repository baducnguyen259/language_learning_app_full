import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class GoogleLoginDto {
  @ApiProperty({
    description: 'Google ID token nhận được từ ứng dụng Flutter',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6...',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  idToken!: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Bắt buộc bằng true khi tạo tài khoản Google mới',
  })
  @IsOptional()
  @IsBoolean()
  acceptTerms?: boolean;
}
