import { Router } from 'express';
import * as c from '../controllers/grades.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const r = Router();
r.get('/:offeringId/breakdown', requireAuth, c.courseGradeBreakdown);
r.get('/:offeringId/current', requireAuth, c.currentWeightedGrade);
r.get('/finals', requireAuth, c.finalPercentPerCourseCompleted);
r.get('/gpa/by-course', requireAuth, c.gpaPerCourse);
r.get('/gpa/cumulative', requireAuth, c.cumulativeGPA);

r.patch('/final', requireAuth, requireRole('admin', 'teacher'), c.updateFinalGrade);

export default r;
