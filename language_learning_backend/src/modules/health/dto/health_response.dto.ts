import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    example: 'up',
  })
  status!: 'up';

  @ApiProperty({
    enum: ['api', 'database'],
    example: 'api',
  })
  service!: 'api' | 'database';

  @ApiProperty({
    example: '2026-08-18T10:00:00.000Z',
  })
  timestamp!: string;
}
