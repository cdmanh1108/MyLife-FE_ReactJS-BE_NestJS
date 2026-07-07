import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

jest.setTimeout(90000);

describe('MyLife OS API (e2e)', () => {
  let app: INestApplication;
  let mongo: MongoMemoryServer | undefined;
  let accessToken = '';

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'test_access_secret';
    process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'test_refresh_secret';
    process.env.REDIS_URL = process.env.REDIS_URL ?? '';

    if (!process.env.MONGODB_URI) {
      mongo = await MongoMemoryServer.create();
      process.env.MONGODB_URI = mongo.getUri();
    }

    const { AppModule } = await import('../src/app.module');
    const { UsersService } = await import('../src/modules/users/application/users.service');

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    await app.init();

    const users = app.get(UsersService);
    await users.createOwnerIfMissing('cdmanh1108@gmail.com', '@Manh11082004');
  });

  afterAll(async () => {
    if (app) await app.close();
    if (mongo) await mongo.stop();
  });

  it('/health (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health').expect(200);
    expect(res.body.success).toBe(true);
  });

  it('/auth/login success', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'cdmanh1108@gmail.com', password: '@Manh11082004' })
      .expect(201);
    accessToken = res.body.data.accessToken;
    expect(accessToken).toBeTruthy();
  });

  it('/auth/login fails with bad password', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'cdmanh1108@gmail.com', password: 'wrong-password' })
      .expect(401);
    expect(res.body.success).toBe(false);
  });

  it('/auth/me requires token', async () => {
    await request(app.getHttpServer()).get('/api/v1/auth/me').expect(401);
    const res = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(res.body.data.email).toBe('cdmanh1108@gmail.com');
  });

  it('creates and lists finance transactions', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/finance/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ type: 'EXPENSE', amount: 50000, currency: 'VND', note: 'Coffee', occurredAt: new Date().toISOString() })
      .expect(201);
    const res = await request(app.getHttpServer())
      .get('/api/v1/finance/transactions?page=1&limit=10')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
  });

  it('creates debt person, record and calculates settlement', async () => {
    const person = await request(app.getHttpServer())
      .post('/api/v1/debts/people')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Bạn A' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/debts/records')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        personId: person.body.data._id,
        direction: 'OWES_ME',
        amount: 100000,
        currency: 'VND',
        note: 'Trả hộ ăn tối',
        occurredAt: new Date().toISOString(),
      })
      .expect(201);

    const settlement = await request(app.getHttpServer())
      .post('/api/v1/debts/settlements/calculate')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);
    expect(settlement.body.data.netBalance).toBeGreaterThanOrEqual(100000);
  });

  it('creates and completes todo', async () => {
    const todo = await request(app.getHttpServer())
      .post('/api/v1/todos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Study TOPIK', priority: 'HIGH' })
      .expect(201);
    const completed = await request(app.getHttpServer())
      .post(`/api/v1/todos/${todo.body.data._id}/complete`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);
    expect(completed.body.data.status).toBe('DONE');
  });

  it('can create OpenAPI document', () => {
    const config = new DocumentBuilder().setTitle('MyLife OS API').setVersion('test').build();
    const doc = SwaggerModule.createDocument(app, config);
    expect(doc.paths).toBeDefined();
  });
});
