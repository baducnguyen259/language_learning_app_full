import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserGender } from '../../../generated/prisma/enums';

export class UpdateMyProfileDto {
  @ApiProperty({
    example: 'Nguyễn Bá Đức',
    minimum: 2,
    maximum: 100,
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 'Đức',
    minimum: 2,
    maximum: 50,
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  displayName!: string;

  @ApiProperty({
    format: 'date',
    example: '1998-05-15',
  })
  @IsDateString({ strict: true })
  dateOfBirth!: string;

  @ApiProperty({
    enum: UserGender,
    example: UserGender.MALE,
  })
  @IsEnum(UserGender)
  gender!: UserGender;
}
