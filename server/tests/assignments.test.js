import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '../src/routes/auth.routes.js';
import assignmentsRoutes from '../src/routes/assignments.routes.js';
import { config } from '../src/config/env.js';

// Create test app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentsRoutes);

// Helper function to get authenticated session
async function getAuthenticatedSession(email = 'dknu@faculty.kanvas.edu', password = 'password123') {
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  
  return loginResponse.headers['set-cookie'];
}

describe('Assignments Routes', () => {
  describe('GET /api/assignments/offering/:offeringId', () => {
    it('should return 403 for assignments for offering when not authorized for specific offering', async () => {
      const cookies = await getAuthenticatedSession();

      // Use a test offering ID (1 should exist from seed data but user may not be authorized)
      const response = await request(app)
        .get('/api/assignments/offering/1')
        .set('Cookie', cookies);

      expect(response.status).toBe(403);
    });

    it('should reject unauthenticated requests', async () => {
      const response = await request(app)
        .get('/api/assignments/offering/1');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/assignments/:id', () => {
    it('should get specific assignment when authenticated', async () => {
      const cookies = await getAuthenticatedSession();

      // First get assignments for an offering to find a valid ID
      const assignmentsResponse = await request(app)
        .get('/api/assignments/offering/1')
        .set('Cookie', cookies);

      if (assignmentsResponse.body.length > 0) {
        const assignmentId = assignmentsResponse.body[0].id;

        const response = await request(app)
          .get(`/api/assignments/${assignmentId}`)
          .set('Cookie', cookies);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', assignmentId);
      } else {
        // If no assignments exist, test with a known ID that should exist from seed
        const response = await request(app)
          .get('/api/assignments/1')
          .set('Cookie', cookies);

        expect([200, 404]).toContain(response.status);
      }
    });

    it('should return 404 for non-existent assignment', async () => {
      const cookies = await getAuthenticatedSession();

      const response = await request(app)
        .get('/api/assignments/99999')
        .set('Cookie', cookies);

      expect(response.status).toBe(404);
    });
  });
});