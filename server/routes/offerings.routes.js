import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import * as c from '../controllers/offerings.controller.js';

const r = Router();

r.post('/', requireAuth, requireRole('admin', 'teacher'), c.createOffering);
r.patch('/:id', requireAuth, requireRole('admin', 'teacher'), c.updateOffering);
r.delete('/:id', requireAuth, requireRole('admin', 'teacher'), c.deleteOffering);

export default r;