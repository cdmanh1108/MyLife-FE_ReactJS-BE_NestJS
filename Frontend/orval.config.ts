import { defineConfig } from 'orval';

export default defineConfig({
  mylife: {
    input: {
      target: 'http://localhost:3010/api/v1/docs-json',
    },
    output: {
      target: './src/shared/api/generated/mylife.ts',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/shared/api/http.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
