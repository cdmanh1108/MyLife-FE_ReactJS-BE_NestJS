import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client?: Redis;
  private enabled = false;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const url = this.config.get<string>('REDIS_URL') ?? this.config.get<string>('redisUrl');
    if (!url) return;
    this.client = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 1, enableOfflineQueue: false });
    try {
      await this.client.connect();
      this.enabled = true;
    } catch {
      this.enabled = false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.enabled || !this.client) return null;
    const raw = await this.client.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    if (!this.enabled || !this.client) return;
    const raw = JSON.stringify(value);
    if (ttlSeconds) await this.client.set(key, raw, 'EX', ttlSeconds);
    else await this.client.set(key, raw);
  }

  async del(key: string): Promise<void> {
    if (!this.enabled || !this.client) return;
    await this.client.del(key);
  }

  async ping(): Promise<boolean> {
    if (!this.enabled || !this.client) return false;
    return (await this.client.ping()) === 'PONG';
  }

  async onModuleDestroy() {
    if (this.client) await this.client.quit();
  }
}
