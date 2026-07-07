import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

@Injectable()
export class TraceIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request & { traceId?: string }>();
    const res = context.switchToHttp().getResponse<Response>();
    const traceId = (req.headers['x-trace-id'] as string | undefined) ?? uuidv4();
    req.traceId = traceId;
    res.setHeader('x-trace-id', traceId);
    return next.handle();
  }
}
