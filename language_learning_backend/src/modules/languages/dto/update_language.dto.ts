import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateLanguageDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z]{2,10}$/, {
    message: 'code chỉ được chứa từ 2 đến 10 chữ cái',
  })
  code?: string;
}
