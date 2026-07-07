import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request & { traceId?: string }>();
    const res = context.switchToHttp().getResponse<Response>();
    const startedAt = Date.now();
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startedAt;
        this.logger.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms traceId=${req.traceId}`);
      }),
    );
  }
}
