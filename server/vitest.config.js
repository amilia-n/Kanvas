import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.js'],
    environment: 'node',
    globals: false,
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    reporter: ['verbose'],
    coverage: {
      reporter: ['text', 'json', 'html']
    },
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgres://postgres:testpassword@test-db:5432/kanvas_test',
      JWT_SECRET: 'test_jwt_secret_for_testing',
      JWT_EXPIRES: '1h',
      PORT: '8888',
      CORS_ORIGIN: 'http://localhost:3000'
    }
  }
});