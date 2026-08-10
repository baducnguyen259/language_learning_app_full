import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import type { Request, Response } from 'express';

import { Prisma } from '../../generated/prisma/client';

type NestHttpErrorResponse = {
  message?: string | string[];
  error?: string;
};

type ErrorInformation = {
  statusCode: number;
  message: string | string[];
  type?: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    const errorInformation = this.getErrorInformation(exception);

    if (errorInformation.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(errorInformation.statusCode).json({
      success: false,
      error: {
        statusCode: errorInformation.statusCode,
        message: errorInformation.message,
        ...(errorInformation.type ? { type: errorInformation.type } : {}),
      },
      path: request.url,
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
        message: 'Không thể kết nối đến cơ sở dữ liệu',
        type: 'Database unavailable',
      };
    }
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
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
        message: exceptionResponse,
      };
    }
    const responseBody = exceptionResponse as NestHttpErrorResponse;
    return {
      statusCode,
      message:
        responseBody.message ?? exception.message ?? 'Request không hợp lệ',
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
          message: 'Dữ liệu đã tồn tại',
          type: 'Unique constraint violation',
        };

      case 'P2003':
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Không thể thực hiện vì dữ liệu đang được liên kết',
          type: 'Foreign key constraint violation',
        };

      case 'P2025':
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Không tìm thấy dữ liệu',
          type: 'Record not found',
        };

      case 'P2023':
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Định dạng dữ liệu không hợp lệ',
          type: 'Invalid database value',
        };

      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Đã xảy ra lỗi cơ sở dữ liệu',
          type: 'Database error',
        };
    }
  }
}
