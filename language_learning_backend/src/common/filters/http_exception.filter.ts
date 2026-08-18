import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { Prisma } from '../../generated/prisma/client';
import {
  ApiErrorCode,
  type ApiErrorCode as ApiErrorCodeType,
} from '../enums/api_error_code.enum';
import type { RequestWithId } from '../middleware/request_id.middleware';

type NestHttpErrorResponse = {
  message?: string | string[];
  error?: string;
  code?: ApiErrorCodeType;
};

type ErrorInformation = {
  statusCode: number;
  code: ApiErrorCodeType;
  message: string | string[];
  type?: string;
};

const HTTP_ERROR_CODES: Partial<Record<number, ApiErrorCodeType>> = {
  [HttpStatus.BAD_REQUEST]: ApiErrorCode.BAD_REQUEST,
  [HttpStatus.UNAUTHORIZED]: ApiErrorCode.UNAUTHORIZED,
  [HttpStatus.FORBIDDEN]: ApiErrorCode.FORBIDDEN,
  [HttpStatus.NOT_FOUND]: ApiErrorCode.RESOURCE_NOT_FOUND,
  [HttpStatus.CONFLICT]: ApiErrorCode.CONFLICT,
  [HttpStatus.TOO_MANY_REQUESTS]: ApiErrorCode.TOO_MANY_REQUESTS,
  [HttpStatus.SERVICE_UNAVAILABLE]: ApiErrorCode.SERVICE_UNAVAILABLE,
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<RequestWithId>();
    const response = context.getResponse<Response>();
    const errorInformation = this.getErrorInformation(exception);

    if (errorInformation.statusCode >= 500) {
      this.logger.error(
        `[${request.requestId}] ${request.method} ${request.originalUrl}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(errorInformation.statusCode).json({
      success: false,
      error: {
        statusCode: errorInformation.statusCode,
        code: errorInformation.code,
        message: errorInformation.message,
        ...(errorInformation.type ? { type: errorInformation.type } : {}),
      },
      path: request.url,
      requestId: request.requestId,
      timestamp: new Date().toISOString(),
    });
  }

  private getErrorInformation(exception: unknown): ErrorInformation {
    if (exception instanceof HttpException) {
      return this.getHttpErrorInformation(exception);
    }
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.getPrismaErrorInformation(exception);
    }
    if (exception instanceof Prisma.PrismaClientInitializationError) {
      return {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        code: ApiErrorCode.DATABASE_UNAVAILABLE,
        message: 'Không thể kết nối đến cơ sở dữ liệu',
        type: 'Database unavailable',
      };
    }
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: ApiErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Đã xảy ra lỗi hệ thống',
      type: 'Internal server error',
    };
  }

  private getHttpErrorInformation(exception: HttpException): ErrorInformation {
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === 'string') {
      return {
        statusCode,
        code: this.getHttpErrorCode(statusCode),
        message: exceptionResponse,
      };
    }
    const responseBody = exceptionResponse as NestHttpErrorResponse;
    const message =
      responseBody.message ?? exception.message ?? 'Yêu cầu không hợp lệ';
    return {
      statusCode,
      code:
        responseBody.code ??
        (Array.isArray(message)
          ? ApiErrorCode.VALIDATION_ERROR
          : this.getHttpErrorCode(statusCode)),
      message,
      type: responseBody.error,
    };
  }

  private getPrismaErrorInformation(
    exception: Prisma.PrismaClientKnownRequestError,
  ): ErrorInformation {
    switch (exception.code) {
      case 'P2002':
        return {
          statusCode: HttpStatus.CONFLICT,
          code: ApiErrorCode.DUPLICATE_RESOURCE,
          message: 'Dữ liệu đã tồn tại',
          type: 'Unique constraint violation',
        };
      case 'P2003':
        return {
          statusCode: HttpStatus.CONFLICT,
          code: ApiErrorCode.RESOURCE_IN_USE,
          message: 'Không thể thực hiện vì dữ liệu đang được liên kết',
          type: 'Foreign key constraint violation',
        };
      case 'P2025':
        return {
          statusCode: HttpStatus.NOT_FOUND,
          code: ApiErrorCode.RESOURCE_NOT_FOUND,
          message: 'Không tìm thấy dữ liệu',
          type: 'Record not found',
        };
      case 'P2023':
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          code: ApiErrorCode.INVALID_DATABASE_VALUE,
          message: 'Định dạng dữ liệu không hợp lệ',
          type: 'Invalid database value',
        };
      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Đã xảy ra lỗi cơ sở dữ liệu',
          type: 'Database error',
        };
    }
  }

  private getHttpErrorCode(statusCode: number): ApiErrorCodeType {
    const mappedCode = HTTP_ERROR_CODES[statusCode];
    if (mappedCode) {
      return mappedCode;
    }
    if (statusCode >= 500) {
      return ApiErrorCode.INTERNAL_SERVER_ERROR;
    }
    return ApiErrorCode.HTTP_ERROR;
  }
}
