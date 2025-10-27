import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import * as c from '../controllers/submissions.controller.js';

const r = Router();
r.post('/', requireAuth, c.submitOrResubmit);
r.post('/grade', requireAuth, requireRole('admin', 'teacher'), c.submitGrade);

r.get('/teacher/all', requireAuth, requireRole('admin', 'teacher'), c.listAllSubmissionsForTeacher);
r.get('/offering/:offeringId', requireAuth, requireRole('admin', 'teacher'), c.listSubmissionsForOffering);

r.get('/my/:offeringId', requireAuth, c.getMySubmissions);

export default r;