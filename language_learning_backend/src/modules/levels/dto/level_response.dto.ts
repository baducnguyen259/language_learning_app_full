import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

class LevelLanguageDto {
  @ApiProperty({
    example: 'cm123language',
  })
  id!: string;

  @ApiProperty({
    example: 'Tiếng Anh',
  })
  name!: string;

  @ApiProperty({
    example: 'en',
  })
  code!: string;
}

class LevelCountDto {
  @ApiProperty({ example: 3 })
  topics!: number;
}

export class LevelResponseDto {
  @ApiProperty({
    example: 'cm123level',
  })
  id!: string;

  @ApiProperty({
    example: 'A1',
  })
  name!: string;

  @ApiProperty({
    example: 1,
  })
  order!: number;

  @ApiProperty({
    example: 'cm123language',
  })
  languageId!: string;

  @ApiPropertyOptional({
    type: LevelLanguageDto,
  })
  language?: LevelLanguageDto;

  @ApiPropertyOptional({
    type: LevelCountDto,
  })
  _count?: LevelCountDto;

  @ApiProperty({
    example: '2026-08-10T10:00:00.000Z',
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-08-10T10:00:00.000Z',
    format: 'date-time',
  })
  updatedAt!: Date;
}
