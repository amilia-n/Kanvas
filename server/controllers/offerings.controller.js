import * as offerings from "../services/offerings.services.js";
import * as users from "../services/users.services.js";

async function requireOfferingOwner(req, offeringId) {
  const row = await offerings.findOffering(offeringId);
  if (!row) return { ok: false, code: 404, message: "Offering not found" };
  if (req.user.role !== "admin" && row.teacher_id !== req.user.id) {
    return { ok: false, code: 403, message: "Forbidden" };
  }
  return { ok: true, row };
}

export async function createOffering(req, res, next) {
  try {
    const data = {
      ...req.body,
      teacher_id: req.user.id,  
    };
    const offering = await offerings.createOffering(data);  
    res.status(201).json(offering);
  } catch (err) {
    next(err);
  }
}

export async function updateOffering(req, res, next) {
  try {
    const id = Number(req.params.id);
    const gate = await requireOfferingOwner(req, id);
    if (!gate.ok) return res.status(gate.code).json({ message: gate.message });

    const row = await offerings.updateOffering(id, req.body);
    res.json(row);
  } catch (err) { next(err); }
}

export async function deleteOffering(req, res, next) {
  try {
    const id = Number(req.params.id);
    const gate = await requireOfferingOwner(req, id);
    if (!gate.ok) return res.status(gate.code).json({ message: gate.message });

    await offerings.deleteOffering(id);
    res.status(204).end();
  } catch (err) { next(err); }
}

export async function getMyOfferings(req, res, next) {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    
    let result;
    if (role === 'teacher' || role === 'admin') {
      result = await offerings.getTeacherOfferings(userId);
    } else {
      result = await offerings.getStudentOfferings(userId);
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function findOffering(req, res, next) {
  try {
    const id = Number(req.params.id);
    const row = await offerings.findOffering(id);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  } catch (err) { next(err); }
}

export async function listOfferingsForCourse(req, res, next) {
  try {
    const courseId = Number(req.params.courseId);
    const result = await offerings.listOfferingsForCourse(courseId);  
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function offeringListWithSeats(req, res, next) {
  try {
    const rows = await offerings.offeringListWithSeats();
    res.json(rows);
  } catch (err) { next(err); }
}

export async function offeringFilter(req, res, next) {
  try {
    const { term_id, teacher_id, q, section, limit, offset } = req.query;
    const rows = await offerings.offeringFilter({
      term_id: term_id ? Number(term_id) : null,
      teacher_id: teacher_id ? Number(teacher_id) : null,
      q: q ?? null,
      section: section ?? null,
      limit: limit ? Number(limit) : null,
      offset: offset ? Number(offset) : null,
    });
    res.json(rows);
  } catch (err) { next(err); }
}

export async function studentHasPassedCourse(req, res, next) {
  try {
    const student_id = Number(req.query.student_id);
    const course_id = Number(req.query.course_id);
    const row = await offerings.studentHasPassedCourse(student_id, course_id);
    res.json(row);
  } catch (err) { next(err); }
}

export async function allPrereqsMetForCourse(req, res, next) {
  try {
    const student_id = Number(req.query.student_id);
    const course_id = Number(req.query.course_id);
    const row = await offerings.allPrereqsMetForCourse(student_id, course_id);
    res.json(row);
  } catch (err) { next(err); }
}

export async function eligibleForStudent(req, res, next) {
  try {
    const offeringId = Number(req.params.id);
    const studentId  = Number(req.params.studentId);

    const gate = await requireOfferingOwner(req, offeringId);
    if (!gate.ok) return res.status(gate.code).json({ message: gate.message });

    const result = await offerings.eligibleForStudent({ offering_id: offeringId, student_id: studentId });
    res.json(result);
  } catch (err) { next(err); }
}


export async function searchClassmates(req, res, next) {
  try {
    const offeringId = Number(req.params.id);
    const q = req.query.q ?? null;

    const isMember = await offerings.isUserInOffering(offeringId, req.user.id);
    
    const offering = await offerings.findOffering(offeringId);
    const isTeacher = offering && offering.teacher_id === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isMember && !isTeacher && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const rows = await users.searchOfferingClassmates(offeringId, q);
    res.json(rows);
  } catch (err) { next(err); }
}

export async function addOfferingPrereq(req, res, next) {
  try {
    const offeringId = Number(req.params.offeringId);
    const { prereq_offering_id } = req.body;
    await offerings.addOfferingPrereq(offeringId, prereq_offering_id);
    res.status(201).json({ message: "Prerequisite added" });
  } catch (err) {
    next(err);
  }
}

export async function removeOfferingPrereq(req, res, next) {
  try {
    const offeringId = Number(req.params.offeringId);
    const prereqOfferingId = Number(req.params.prereqOfferingId);
    await offerings.removeOfferingPrereq(offeringId, prereqOfferingId);
    res.json({ message: "Prerequisite removed" });
  } catch (err) {
    next(err);
  }
}