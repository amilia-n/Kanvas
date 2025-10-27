import pool from "../db/pool.js";
import { queries } from "../db/queries.js";

export async function submitOrResubmit({
  assignment_id,
  student_id,
  submission_url,
}) {
  const { rows } = await pool.query(queries.submitOrResubmit, [
    assignment_id,
    student_id,
    submission_url,
  ]);
  return rows[0];
}

export async function submitGrade({
  grade_percent,
  assignment_id,
  student_id,
  graded_by,
}) {
  await pool.query(queries.submitGrade, [
    grade_percent,
    graded_by,
    assignment_id,
    student_id,
  ]);
  return { ok: true };
}

export async function listSubmissionsForOffering(offeringId) {
  const { rows } = await pool.query(queries.listSubmissionsForOffering, [
    offeringId,
  ]);
  return rows;
}

export async function getMySubmissions(offeringId, studentId) {
  const { rows } = await pool.query(queries.getMySubmissions, [
    offeringId,
    studentId,
  ]);
  return rows;
}

export async function getAssignmentTeacher(assignmentId) {
  const { rows } = await pool.query(queries.teacherIdForAssignment, [
    assignmentId,
  ]);
  return rows[0];
}

export async function listAllSubmissionsForTeacher(teacherId) {
  const { rows } = await pool.query(queries.listAllSubmissionsForTeacher, [
    teacherId,
  ]);
  return rows;
}
