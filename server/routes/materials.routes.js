import { Router } from 'express';
import * as c from '../controllers/materials.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const r = Router();

r.post('/', requireAuth, requireRole('admin', 'teacher'), c.addMaterial);
r.delete('/:id', requireAuth, requireRole('admin', 'teacher'), c.deleteMaterial);

r.get('/:offeringId', requireAuth, c.listMaterials);

export default r;


