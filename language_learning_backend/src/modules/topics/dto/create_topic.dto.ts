import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  name!: string;

  @IsString()
  @IsNotEmpty()
  levelId!: string;
}
