import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/modules/users/application/users.service';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['log', 'error', 'warn'] });
  const config = app.get(ConfigService);
  const users = app.get(UsersService);
  const email = config.get<string>('SEED_OWNER_EMAIL') ?? 'cdmanh1108@gmail.com';
  const password = config.get<string>('SEED_OWNER_PASSWORD') ?? '@Manh11082004';
  const owner = await users.createOwnerIfMissing(email, password);
  console.log(`Seed owner ready: ${owner.email}`);
  await app.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
