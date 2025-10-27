import pool from "../db/pool.js";
import { queries } from "../db/queries.js";

export async function createOffering({
  course_id,
  term_id,
  teacher_id,
  code,
  name,
  description,
  section,
  credits,
  total_seats,
  enrollment_open,
  is_active,
}) {
  if (!teacher_id) {
    throw new Error("teacher_id is required when creating an offering");
  }
  const { rows } = await pool.query(queries.createOffering, [
    course_id,
    term_id,
    teacher_id,
    code,
    name,
    description,
    section,
    credits,
    total_seats,
    enrollment_open ?? true,
    is_active ?? true,
  ]);
  return rows[0];
}

export async function updateOffering(
  id,
  {
    name,
    description,
    section,
    credits,
    total_seats,
    enrollment_open,
    is_active,
  }
) {
  const { rows } = await pool.query(queries.updateOffering, [
    id,
    name ?? null,
    description ?? null,
    section ?? null,
    credits,
    total_seats ?? null,
    enrollment_open ?? null,
    is_active ?? null,
  ]);
  return rows[0];
}

export async function deleteOffering(id) {
  await pool.query(queries.deleteOffering, [id]);
  return { ok: true };
}

export async function findOffering(id) {
  const { rows } = await pool.query(queries.findOffering, [id]);
  const result = rows[0] || null;

  if (result && !result.prerequisites) {
    result.prerequisites = [];
  }

  console.log("Offering with prereqs:", result);

  return result;
}

export async function listOfferingsForCourse(courseId) {
  const { rows } = await pool.query(queries.listOfferingsForCourse, [courseId]);
  return rows;
}

export async function offeringListWithSeats() {
  const { rows } = await pool.query(queries.offeringListWithSeats);
  return rows;
}

export async function offeringFilter({
  term_id,
  teacher_id,
  q,
  section,
  limit,
  offset,
}) {
  const { rows } = await pool.query(queries.offeringFilter, [
    term_id ?? null,
    teacher_id ?? null,
    q ?? null,
    section ?? null,
    limit ?? null,
    offset ?? null,
  ]);
  return rows;
}

export async function studentHasPassedCourse(student_id, course_id) {
  const { rows } = await pool.query(queries.studentHasPassedCourse, [
    student_id,
    course_id,
  ]);
  return rows[0];
}

export async function allPrereqsMetForCourse(student_id, course_id) {
  const { rows } = await pool.query(queries.allPrereqsMetForOffering, [
    student_id,
    course_id,
  ]);
  return rows[0];
}

export async function eligibleForStudent({ offering_id, student_id }) {
  const { rows: offRows } = await pool.query(queries.offeringEligibilityInfo, [
    offering_id,
  ]);
  const off = offRows[0];
  if (!off) return { eligible: false, reasons: ["Offering not found"] };

  const { rows: enrolRows } = await pool.query(queries.enrollmentStatus, [
    offering_id,
    student_id,
  ]);
  const currentStatus = enrolRows[0]?.status ?? null;

  const { ok: prereqs_ok } = (await allPrereqsMetForCourse(
    student_id,
    off.course_id
  )) ?? { ok: false };
  const { ok: passed_already } = (await studentHasPassedCourse(
    student_id,
    off.course_id
  )) ?? { ok: false };

  const reasons = [];
  if (off.is_active !== true) reasons.push("Offering is not active");
  if (off.enrollment_open !== true)
    reasons.push("Enrollment is closed by instructor");
  if ((off.seats_left ?? 0) <= 0) reasons.push("No seats available");
  if (currentStatus)
    reasons.push(`Student already has status: ${currentStatus}`);
  if (!prereqs_ok) reasons.push("Prerequisites not met");
  if (passed_already) reasons.push("Student already passed this course");

  return {
    eligible: reasons.length === 0,
    reasons,
    details: {
      offering_id,
      student_id,
      is_active: off.is_active,
      enrollment_open: off.enrollment_open,
      seats_left: off.seats_left,
      prereqs_ok,
      passed_already,
      current_status: currentStatus,
    },
  };
}
