import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateTopicDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsString()
  levelId?: string;
}
