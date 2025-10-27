import { Router } from 'express';
import * as c from '../controllers/users.controller.js';
import { requireAuth, requireRole, requireAdmin, requireSelfOrAdmin } from '../middleware/auth.js';

const r = Router();
r.get('/', requireAuth, requireRole('admin', 'teacher'), c.listUsers);
r.get('/search', requireAuth, requireRole('admin', 'teacher'), c.searchUsers);
r.post('/', requireAuth, requireAdmin, c.createUser);
r.get('/:id', requireAuth, requireSelfOrAdmin(), c.getUser);
r.patch('/:id', requireAuth, requireSelfOrAdmin(), c.updateUser);
r.delete('/:id', requireAuth, requireAdmin, c.deleteUser);

r.get('/:id/majors', requireAuth, requireSelfOrAdmin(), c.listUserMajors);
r.post('/:id/majors', requireAuth, requireSelfOrAdmin(), c.addUserMajor);
r.delete('/:id/majors/:code', requireAuth, requireSelfOrAdmin(), c.removeUserMajor);
r.post('/:id/majors/bulk', requireAuth, requireSelfOrAdmin(), c.addUserMajorsBulk);
r.put('/:id/majors', requireAuth, requireSelfOrAdmin(), c.replaceUserMajors);
export default r;