import pool from "../db/pool.js";
import { queries } from "../db/queries.js";

export async function courseGradeBreakdown(student_id, offering_id) {
  const { rows } = await pool.query(queries.courseGradeBreakdown, [
    student_id,
    offering_id,
  ]);
  return rows;
}

export async function currentWeightedGrade(student_id, offering_id) {
  const { rows } = await pool.query(queries.currentWeightedGrade, [
    student_id,
    offering_id,
  ]);
  return rows[0];
}

export async function finalPercentPerCourseCompleted(student_id) {
  const { rows } = await pool.query(queries.finalPercentPerCourseCompleted, [
    student_id,
  ]);
  return rows;
}

export async function gpaPerCourse(student_id) {
  const { rows } = await pool.query(queries.gpaPerCourse, [student_id]);
  return rows;
}

export async function cumulativeGPA(student_id) {
  const { rows } = await pool.query(queries.cumulativeGPA, [student_id]);
  return rows[0];
}

export async function updateFinalGrade(offering_id, student_id, final_percent) {
  const { rows } = await pool.query(queries.updateFinalGrade, [
    offering_id,
    student_id,
    final_percent,
  ]);
  return rows[0] || null;
}
