import pool from "../db/pool.js";
import { queries } from "../db/queries.js";

export async function getCourse(id) {
  const { rows } = await pool.query(queries.getCourseById, [id]);
  return rows[0] ?? null;
}

export async function getCourseIdByCode(code) {
  const { rows } = await pool.query(queries.getCourseIdByCode, [code]);
  return rows[0] ?? null;
}

export async function listCourses() {
  const { rows } = await pool.query(queries.listCourses);
  return rows;
}

export async function listCoursesWithOfferings() {
  const { rows } = await pool.query(queries.listCoursesWithOfferings);
  return rows;
}
