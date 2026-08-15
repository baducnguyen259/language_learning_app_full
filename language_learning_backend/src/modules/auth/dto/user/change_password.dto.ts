import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'Korean123',
    writeOnly: true,
  })
  @IsString()
  @MinLength(9)
  @MaxLength(16)
  currentPassword!: string;

  @ApiProperty({
    example: 'Korean456',
    minLength: 9,
    maxLength: 16,
    writeOnly: true,
    description: 'Mật khẩu phải có chữ hoa, chữ thường và chữ số',
  })
  @IsString()
  @MinLength(9)
  @MaxLength(16)
  @Matches(/[a-z]/, {
    message: 'Mật khẩu mới phải có ít nhất một chữ thường',
  })
  @Matches(/[A-Z]/, {
    message: 'Mật khẩu mới phải có ít nhất một chữ hoa',
  })
  @Matches(/[0-9]/, {
    message: 'Mật khẩu mới phải có ít nhất một chữ số',
  })
  newPassword!: string;

  @ApiProperty({
    example: 'Korean456',
    writeOnly: true,
  })
  @IsString()
  @MinLength(9)
  @MaxLength(16)
  confirmNewPassword!: string;
}

export class ChangePasswordResponseDto {
  @ApiProperty({
    example: 'Đổi mật khẩu thành công',
  })
  message!: string;
}
