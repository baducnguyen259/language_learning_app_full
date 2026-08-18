import { ApiProperty } from '@nestjs/swagger';
import {
  ApiErrorCode,
  type ApiErrorCode as ApiErrorCodeType,
} from '../enums/api_error_code.enum';

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

  @ApiProperty({ example: '/api/admin/languages' })
  path!: string;

  @ApiProperty({
    example: 'e4235d14-a7e4-4caa-9f07-a824b4bc7c82',
    format: 'uuid',
  })
  requestId!: string;

  @ApiProperty({
    example: '2026-08-18T10:00:00.000Z',
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
    enum: Object.values(ApiErrorCode),
    example: ApiErrorCode.VALIDATION_ERROR,
  })
  code!: ApiErrorCodeType;

  @ApiProperty({
    oneOf: [
      {
        type: 'string',
        example: 'Yêu cầu không hợp lệ',
      },
      {
        type: 'array',
        items: { type: 'string' },
        example: [
          'Email không đúng định dạng',
          'Mật khẩu phải có ít nhất 8 ký tự',
        ],
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

  @ApiProperty({ example: '/api/admin/languages' })
  path!: string;

  @ApiProperty({
    example: 'e4235d14-a7e4-4caa-9f07-a824b4bc7c82',
    format: 'uuid',
  })
  requestId!: string;

  @ApiProperty({
    example: '2026-08-18T10:00:00.000Z',
    format: 'date-time',
  })
  timestamp!: string;
}
