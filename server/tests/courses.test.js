import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '../src/routes/auth.routes.js';
import coursesRoutes from '../src/routes/courses.routes.js';
import { config } from '../src/config/env.js';

// Create test app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);

// Helper function to get authenticated session
async function getAuthenticatedSession(email = 'dknu@faculty.kanvas.edu', password = 'password123') {
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  
  return loginResponse.headers['set-cookie'];
}

describe('Courses Routes', () => {
  describe('GET /api/courses', () => {
    it('should get courses when authenticated', async () => {
      const cookies = await getAuthenticatedSession();

      const response = await request(app)
        .get('/api/courses')
        .set('Cookie', cookies);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should reject unauthenticated requests', async () => {
      const response = await request(app)
        .get('/api/courses');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/courses/:id', () => {
    it('should get specific course when authenticated', async () => {
      const cookies = await getAuthenticatedSession();

      // First get all courses to find a valid ID
      const coursesResponse = await request(app)
        .get('/api/courses')
        .set('Cookie', cookies);

      if (coursesResponse.body.length > 0) {
        const courseId = coursesResponse.body[0].id;

        const response = await request(app)
          .get(`/api/courses/${courseId}`)
          .set('Cookie', cookies);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', courseId);
      }
    });

    it('should return 404 for non-existent course', async () => {
      const cookies = await getAuthenticatedSession();

      const response = await request(app)
        .get('/api/courses/99999')
        .set('Cookie', cookies);

      expect(response.status).toBe(404);
    });
  });
});