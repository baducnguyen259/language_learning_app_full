import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GoogleLoginDto {
  @ApiProperty({
    description: 'Google ID token nhận được từ ứng dụng Flutter',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6...',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  idToken!: string;
}
