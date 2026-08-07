import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateLevelDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsInt()
  @Min(1)
  order!: number;

  @IsString()
  @IsNotEmpty()
  languageId!: string;
}
