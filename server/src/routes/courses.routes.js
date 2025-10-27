import { Router } from 'express';
import * as c from '../controllers/courses.controller.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();

r.get('/with-offerings', requireAuth, c.listCoursesWithOfferings);
r.get('/', requireAuth, c.listCourses);
r.get('/:id', requireAuth, c.getCourseById);
r.get('/code/:code/id', requireAuth, c.getCourseIdByCode);

export default r;
