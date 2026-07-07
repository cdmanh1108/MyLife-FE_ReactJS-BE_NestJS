# API Generation

Backend exposes OpenAPI schema at:
```
GET http://localhost:3000/api/v1/docs-json
```

To generate the typed API client run:
```bash
npm run generate:api
```

Generated files land in `src/shared/api/generated/`.
The generated client should be used as the base for all API calls.
Never manually create TypeScript types that duplicate the backend schema.
