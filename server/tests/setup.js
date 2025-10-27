import { beforeAll, afterAll } from 'vitest';
import pool from '../src/db/pool.js';

// Global test setup
beforeAll(async () => {
  // Ensure database connection is established
  const client = await pool.connect();
  client.release();
});

// Global test teardown
afterAll(async () => {
  await pool.end();
});