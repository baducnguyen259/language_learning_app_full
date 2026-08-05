import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLanguageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]{2,10}$/, {
    message: 'code chỉ được chứa từ 2 đến 10 chữ cái',
  })
  code!: string;
}
