import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token nhận được khi đăng nhập',
    writeOnly: true,
  })
  @IsString()
  @MinLength(40)
  @MaxLength(500)
  refreshToken!: string;
}

export class TokenPairResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken!: string;
  @ApiProperty({ description: 'Token dùng để lấy access token mới' })
  refreshToken!: string;
}

export class LogoutResponseDto {
  @ApiProperty({ example: 'Đăng xuất thành công' })
  message!: string;
}
