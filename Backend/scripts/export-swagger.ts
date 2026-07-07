import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { promises as fs } from 'fs';
import { join } from 'path';
import { AppModule } from '../src/app.module';

async function run() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const config = new DocumentBuilder()
    .setTitle('MyLife OS API')
    .setDescription('OpenAPI contract for MyLife OS frontend')
    .setVersion('0.1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const outDir = join(process.cwd(), 'contracts');
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(join(outDir, 'openapi.json'), JSON.stringify(document, null, 2), 'utf8');
  await app.close();
  console.log('OpenAPI exported to contracts/openapi.json');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
