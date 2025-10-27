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
  is_active 
}) {
  if (!teacher_id) {
    throw new Error('teacher_id is required when creating an offering');
  }
  const { rows } = await pool.query(queries.createOffering, [
    course_id, term_id, teacher_id, code, name, description, 
    section, credits, total_seats, enrollment_open ?? true, is_active ?? true,
  ]);
  return rows[0];
}

export async function updateOffering(id, { 
  name, 
  description, 
  section, 
  credits, 
  total_seats, 
  enrollment_open, 
  is_active 
}) {
  
  const { rows } = await pool.query(queries.updateOffering, [
    id, name ?? null, description ?? null, section ?? null, 
    credits, total_seats ?? null, enrollment_open ?? null, is_active ?? null
  ]);
  return rows[0];
}

export async function deleteOffering(id) {
  await pool.query(queries.deleteOffering, [id]);
  return { ok: true };
}
