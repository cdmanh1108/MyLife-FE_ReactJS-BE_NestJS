# MyLife OS Backend

Backend NestJS cho **MyLife OS** — web app cá nhân để quản lý cuộc sống: tài chính, chi tiêu, nợ bạn bè, todo, mục tiêu dài hạn, timeline cuộc đời, nhật ký, media, sở thích, IELTS/TOPIK learning hub và dashboard tổng quan.

## Tech stack

- NestJS + TypeScript
- MongoDB + Mongoose
- Redis-ready cache/service
- JWT access token + refresh token rotation
- Swagger/OpenAPI contract
- Jest + Supertest e2e tests
- Clean modular architecture

## API contract cho Frontend

Backend expose Swagger UI và OpenAPI JSON tại:

- Swagger UI: `http://localhost:3000/api/v1/docs`
- OpenAPI JSON: `http://localhost:3000/api/v1/docs-json`

Frontend chỉ cần generate client từ URL này, ví dụ:

```bash
npm run generate:api
```

Khuyến nghị frontend dùng `orval` hoặc `openapi-typescript` để sinh client vào `src/shared/api/generated`.

## Cài đặt nhanh

```bash
cp .env.example .env
npm install
docker compose up -d
npm run migration:up
npm run seed
npm run start:dev
```

Login seed account:

```txt
email: cdmanh1108@gmail.com
password: @Manh11082004
```

> Đây là account local/dev theo yêu cầu. Khi deploy thật, hãy đổi password và secret trong `.env`.

## Environment variables

Xem `.env.example`.

Biến quan trọng:

```txt
PORT=3000
API_PREFIX=api/v1
MONGODB_URI=mongodb://localhost:27017/mylife_os
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=change_me_access
JWT_REFRESH_SECRET=change_me_refresh
CORS_ORIGIN=http://localhost:5173
```

## Scripts

```bash
npm run start:dev       # chạy dev
npm run build           # build production
npm run start:prod      # chạy dist
npm run test            # unit tests
npm run test:e2e        # e2e tests
npm run seed            # tạo owner account
npm run migration:up    # tạo indexes
npm run migration:down  # drop non-_id indexes chính
npm run swagger:export  # export contracts/openapi.json
```

## Response format

Success:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {}
}
```

Error:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {},
    "traceId": "uuid"
  },
  "meta": {}
}
```

Pagination:

```json
{
  "success": true,
  "data": [],
  "error": null,
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Modules

- `auth`: login, refresh, logout, me
- `users/profile`: profile, biography
- `dashboard`: tổng quan cuộc sống
- `finance`: transactions, categories, budgets, statistics
- `debts`: people, records, settlement calculation
- `todos`: daily tasks
- `goals`: long-term plans + milestones
- `timeline`: life milestones
- `journal`: mood journal / personal posts
- `media`: local upload + albums
- `interests`: music, movie, actor, game, book, quote, anime
- `learning`: IELTS/TOPIK vocabulary, flashcards, mock tests, plans, logs
- `notifications`: SSE stream base
- `health`: liveness/readiness

## Architecture notes

Codebase được chia theo modular monolith:

```txt
src/
  common/              # decorators, filters, interceptors, dto, utils
  infrastructure/      # database, redis, storage, logger
  modules/             # bounded contexts / feature modules
    auth/
    users/
    finance/
    debts/
    todos/
    goals/
    timeline/
    journal/
    media/
    interests/
    learning/
```

Các module quan trọng có cấu trúc gần clean architecture:

```txt
module/
  domain/
  application/
  infrastructure/
  presentation/
```

Controller không gọi thẳng Mongoose ở các module chính; controller gọi service/application layer. Dữ liệu luôn được scope theo `userId` để tránh đọc/sửa dữ liệu của user khác.

## Security notes

- Password hash bằng bcrypt.
- Refresh token được hash trước khi lưu DB.
- Refresh token rotate khi gọi `/auth/refresh`.
- Global JWT guard bảo vệ route, trừ route có `@Public()`.
- Helmet + CORS enabled.
- Global validation pipe: whitelist, transform, forbid non-whitelisted.
- Response lỗi có `traceId`.
- Không log password/token.

## Test

Chạy e2e:

```bash
npm run test:e2e
```

Test dùng `mongodb-memory-server` để không phụ thuộc database local.

## Frontend integration flow

1. Chạy backend:

```bash
npm run start:dev
```

2. Mở Swagger:

```txt
http://localhost:3000/api/v1/docs
```

3. Frontend generate API client từ:

```txt
http://localhost:3000/api/v1/docs-json
```

4. Frontend gọi API base URL:

```txt
http://localhost:3000/api/v1
```

## Verification performed in this generated package

- `npm install --ignore-scripts` completed in the sandbox.
- `npm run build` completed successfully.
- `npm run test:e2e` was not fully runnable in the sandbox because `mongodb-memory-server` needs to download a MongoDB binary on first run and the sandbox DNS could not resolve `fastdl.mongodb.org`. Locally, either run `docker compose up -d` and set `MONGODB_URI`, or allow `mongodb-memory-server` to download its binary once.
