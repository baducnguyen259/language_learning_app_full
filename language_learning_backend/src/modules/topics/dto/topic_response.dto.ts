import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

class TopicLanguageDto {
  @ApiProperty({ example: 'cm123language' })
  id!: string;

  @ApiProperty({ example: 'Tiếng Anh' })
  name!: string;

  @ApiProperty({ example: 'en' })
  code!: string;
}

class TopicLevelDto {
  @ApiProperty({ example: 'cm123level' })
  id!: string;

  @ApiProperty({ example: 'A1' })
  name!: string;

  @ApiProperty({ example: 1 })
  order!: number;

  @ApiProperty({ example: 'cm123language' })
  languageId!: string;

  @ApiProperty({ type: TopicLanguageDto })
  language!: TopicLanguageDto;
}

class TopicCountDto {
  @ApiProperty({ example: 5 })
  lessons!: number;
}

export class TopicResponseDto {
  @ApiProperty({ example: 'cm123topic' })
  id!: string;

  @ApiProperty({ example: 'Gia đình' })
  name!: string;

  @ApiProperty({ example: 'cm123level' })
  levelId!: string;

  @ApiPropertyOptional({ type: TopicLevelDto })
  level?: TopicLevelDto;

  @ApiPropertyOptional({ type: TopicCountDto })
  _count?: TopicCountDto;

  @ApiProperty({ example: '2026-08-10T10:00:00.000Z', format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-10T10:00:00.000Z', format: 'date-time' })
  updatedAt!: Date;
}
