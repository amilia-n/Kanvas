import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '../src/routes/auth.routes.js';
import usersRoutes from '../src/routes/users.routes.js';
import { config } from '../src/config/env.js';

// Create test app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// Helper function to get authenticated session
async function getAuthenticatedSession(email = 'dknu@faculty.kanvas.edu', password = 'password123') {
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  
  return loginResponse.headers['set-cookie'];
}

describe('Users Routes', () => {
  describe('GET /api/users', () => {
    it('should get users when authenticated as teacher', async () => {
      const cookies = await getAuthenticatedSession();

      const response = await request(app)
        .get('/api/users')
        .set('Cookie', cookies);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should reject unauthenticated requests', async () => {
      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return 403 when trying to access specific user (authorization required)', async () => {
      const cookies = await getAuthenticatedSession();

      // First get all users to find a valid ID
      const usersResponse = await request(app)
        .get('/api/users')
        .set('Cookie', cookies);

      const userId = usersResponse.body[0].id;

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Cookie', cookies);

      expect(response.status).toBe(403);
    });

    it('should return 403 for non-existent user (authorization required)', async () => {
      const cookies = await getAuthenticatedSession();

      const response = await request(app)
        .get('/api/users/99999')
        .set('Cookie', cookies);

      expect(response.status).toBe(403);
    });
  });
});