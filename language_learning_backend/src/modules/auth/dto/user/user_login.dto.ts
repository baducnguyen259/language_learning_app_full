import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    example: 'user@example.com',
  })
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiProperty({
    example: 'Korean123',
  })
  @IsString()
  @MinLength(9)
  @MaxLength(16)
  password!: string;
}
