import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import * as c from '../controllers/assignments.controller.js';

const r = Router();

r.post('/', requireAuth, requireRole('admin', 'teacher'), c.createAssignment);
r.patch('/:id', requireAuth, requireRole('admin', 'teacher'), c.updateAssignment);
r.delete('/:id', requireAuth, requireRole('admin', 'teacher'), c.deleteAssignment);
r.patch('/:id/open', requireAuth, requireRole('admin', 'teacher'), c.openSubmissions);
r.patch('/:id/close', requireAuth, requireRole('admin', 'teacher'), c.closeSubmissions);

r.get('/offering/:offeringId', requireAuth, c.listForOffering);

r.get('/:id', requireAuth, c.getAssignmentById);

export default r;