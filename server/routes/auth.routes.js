import { Router } from 'express';
import * as c from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
r.post('/register/student', c.registerStudent);
r.post('/register/teacher', c.registerTeacher);
r.post('/login', c.login);
r.post('/logout', requireAuth, c.logout);
r.get('/me', requireAuth, c.me);
r.post('/reset/begin', c.beginReset);
r.post('/reset/check', c.checkReset);
r.post('/reset/finish', c.finishReset);
export default r;