import { Router } from 'express';
import * as c from '../controllers/enrollments.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const r = Router();
r.post('/waitlist', requireAuth, c.requestWaitlist);
r.delete('/waitlist', requireAuth, c.selfCancelWaitlist);

r.post('/approve', requireAuth, requireRole('admin', 'teacher'), c.approveFromWaitlist);
r.post('/deny', requireAuth, requireRole('admin', 'teacher'), c.denyWaitlist);
r.post('/drop', requireAuth, requireRole('admin', 'teacher'), c.dropEnrollment);
r.post('/complete', requireAuth, requireRole('admin', 'teacher'), c.markCompleted);

r.get('/:offeringId/waitlist', requireAuth, requireRole('admin', 'teacher'), c.listWaitlist);
r.get('/:offeringId/enrolled', requireAuth, requireRole('admin', 'teacher'), c.listEnrolled);
r.get('/:offeringId/seats-left', requireAuth, c.seatsLeft);


export default r;

