import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class LanguageCountDto {
  @ApiProperty({
    example: 3,
  })
  levels!: number;
}

export class LanguageResponseDto {
  @ApiProperty({
    example: 'cm123language',
  })
  id!: string;

  @ApiProperty({
    example: 'Tiếng Hàn',
  })
  name!: string;

  @ApiProperty({
    example: 'en',
  })
  code!: string;

  @ApiPropertyOptional({
    type: LanguageCountDto,
  })
  _count?: LanguageCountDto;

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
