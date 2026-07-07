import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Connection } from 'mongoose';
import { Public } from '../../common/decorators/public.decorator';
import { RedisService } from '../../infrastructure/redis/redis.service';
@ApiTags('health')
@Public()
@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly redis: RedisService,
  ) {}
  @Get() @ApiOperation({ summary: 'Basic health' }) health() {
    return { status: 'ok', service: 'mylife-os-backend', time: new Date().toISOString() };
  }
  @Get('liveness') liveness() {
    return { status: 'alive' };
  }
  @Get('readiness') async readiness() {
    return {
      status: this.connection.readyState === 1 ? 'ready' : 'degraded',
      mongodb: this.connection.readyState === 1,
      redis: await this.redis.ping(),
    };
  }
}
