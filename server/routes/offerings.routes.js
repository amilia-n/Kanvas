import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import * as c from '../controllers/offerings.controller.js';

const r = Router();

r.post('/', requireAuth, requireRole('admin', 'teacher'), c.createOffering);
r.patch('/:id', requireAuth, requireRole('admin', 'teacher'), c.updateOffering);
r.delete('/:id', requireAuth, requireRole('admin', 'teacher'), c.deleteOffering);

r.delete('/:offeringId/prereqs/:prereqOfferingId', requireAuth, requireRole('admin', 'teacher'), c.removeOfferingPrereq);
r.post('/:offeringId/prereqs', requireAuth, requireRole('admin', 'teacher'), c.addOfferingPrereq);

r.get('/my', requireAuth, c.getMyOfferings);
r.get('/filter', requireAuth, c.offeringFilter);
r.get('/eligibility/passed', requireAuth, c.studentHasPassedCourse);
r.get('/eligibility/prereqs', requireAuth, c.allPrereqsMetForCourse);
r.get('/course/:courseId', requireAuth, c.listOfferingsForCourse);

r.get('/:id/eligible/:studentId', requireAuth, requireRole('admin','teacher'), c.eligibleForStudent);
r.get('/:id/classmates/search', requireAuth, c.searchClassmates);




export default r;