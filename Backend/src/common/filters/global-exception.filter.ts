import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCodes } from '../constants/error-codes';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { traceId?: string }>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
    const message = this.getMessage(exceptionResponse, exception);
    const code = this.getCode(status, exceptionResponse);
    const details = typeof exceptionResponse === 'object' && exceptionResponse !== null ? exceptionResponse : undefined;

    response.status(status).json({
      success: false,
      data: null,
      error: {
        code,
        message,
        details,
        traceId: request.traceId ?? request.headers['x-trace-id'] ?? '',
      },
      meta: {
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
      },
    });
  }

  private getMessage(exceptionResponse: unknown, exception: unknown): string {
    if (typeof exceptionResponse === 'string') return exceptionResponse;
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const maybe = exceptionResponse as { message?: string | string[] };
      if (Array.isArray(maybe.message)) return maybe.message.join(', ');
      if (maybe.message) return maybe.message;
    }
    if (exception instanceof Error) return exception.message;
    return 'Internal server error';
  }

  private getCode(status: number, exceptionResponse: unknown): string {
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const maybe = exceptionResponse as { code?: string };
      if (maybe.code) return maybe.code;
    }
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        return ErrorCodes.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ErrorCodes.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorCodes.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ErrorCodes.CONFLICT;
      case HttpStatus.BAD_REQUEST:
        return ErrorCodes.BAD_REQUEST;
      default:
        return ErrorCodes.INTERNAL_SERVER_ERROR;
    }
  }
}
