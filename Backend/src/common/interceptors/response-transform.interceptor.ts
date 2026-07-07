import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { PaginatedResult } from '../dto/pagination.dto';

function isPaginated<T>(value: unknown): value is PaginatedResult<T> {
  return Boolean(value && typeof value === 'object' && 'items' in value && 'meta' in value);
}

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((payload) => {
        if (payload && typeof payload === 'object' && 'success' in payload && 'error' in payload) {
          return payload;
        }
        if (isPaginated(payload)) {
          return { success: true, data: payload.items, error: null, meta: payload.meta };
        }
        return { success: true, data: payload ?? null, error: null, meta: {} };
      }),
    );
  }
}
