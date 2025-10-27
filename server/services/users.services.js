import pool from "../db/pool.js";  
import { queries } from '../db/queries.js';

export async function createUser(payload) {
  const { role, email, password_hash, first_name, last_name, student_number, teacher_number } = payload;
  const { rows } = await pool.query(queries.createUser, [
    role, email, password_hash, first_name, last_name, student_number, teacher_number,
  ]);
  return rows[0];
}