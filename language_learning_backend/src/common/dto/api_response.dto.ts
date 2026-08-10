import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;
}

export class ApiSuccessResponseDto {
  @ApiProperty({
    example: true,
    enum: [true],
  })
  success!: true;

  @ApiProperty({
    description: 'Dữ liệu do endpoint trả về',
    type: Object,
  })
  data!: unknown;

  @ApiProperty({
    example: '/api/admin/languages',
  })
  path!: string;

  @ApiProperty({
    example: '2026-08-10T10:00:00.000Z',
    format: 'date-time',
  })
  timestamp!: string;
}

export class ApiErrorDetailDto {
  @ApiProperty({
    example: 400,
  })
  statusCode!: number;

  @ApiProperty({
    oneOf: [
      {
        type: 'string',
        example: 'Request không hợp lệ',
      },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
  })
  message!: string | string[];

  @ApiProperty({
    required: false,
    example: 'Bad Request',
  })
  type?: string;
}

export class ApiErrorResponseDto {
  @ApiProperty({
    example: false,
    enum: [false],
  })
  success!: false;

  @ApiProperty({
    type: ApiErrorDetailDto,
  })
  error!: ApiErrorDetailDto;

  @ApiProperty({
    example: '/api/admin/languages',
  })
  path!: string;

  @ApiProperty({
    example: '2026-08-10T10:00:00.000Z',
    format: 'date-time',
  })
  timestamp!: string;
}
