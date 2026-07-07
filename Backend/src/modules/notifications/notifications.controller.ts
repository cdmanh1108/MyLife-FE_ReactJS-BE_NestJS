import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { interval, map, Observable } from 'rxjs';
@ApiTags('notifications')
@ApiBearerAuth('access-token')
@Controller('notifications')
export class NotificationsController {
  @Sse('stream') stream(): Observable<MessageEvent> {
    return interval(30000).pipe(
      map(() => ({
        data: { type: 'HEARTBEAT', message: 'MyLife OS notification stream alive', at: new Date().toISOString() },
      })),
    );
  }
}
