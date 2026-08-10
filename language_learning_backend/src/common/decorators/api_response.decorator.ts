import { applyDecorators, type Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ApiErrorResponseDto,
  ApiSuccessResponseDto,
  PaginationMetaDto,
} from '../dto/api_response.dto';

export function ApiOkEnvelope<TModel>(model: Type<TModel>) {
  return applyDecorators(
    ApiExtraModels(ApiSuccessResponseDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(ApiSuccessResponseDto),
          },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
}

export function ApiCreatedEnvelope<TModel>(model: Type<TModel>) {
  return applyDecorators(
    ApiExtraModels(ApiSuccessResponseDto, model),
    ApiCreatedResponse({
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(ApiSuccessResponseDto),
          },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
}

export function ApiPaginatedEnvelope<TModel>(model: Type<TModel>) {
  return applyDecorators(
    ApiExtraModels(ApiSuccessResponseDto, PaginationMetaDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(ApiSuccessResponseDto),
          },
          {
            properties: {
              data: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      $ref: getSchemaPath(model),
                    },
                  },
                  meta: {
                    $ref: getSchemaPath(PaginationMetaDto),
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
}

export function ApiAdminErrorResponses() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Thiếu access token hoặc token không hợp lệ',
      type: ApiErrorResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Tài khoản không có quyền quản trị',
      type: ApiErrorResponseDto,
    }),
  );
}

export function ApiNotFoundErrorResponse() {
  return ApiNotFoundResponse({
    description: 'Không tìm thấy dữ liệu',
    type: ApiErrorResponseDto,
  });
}
