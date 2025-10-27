import pool from "../db/pool.js";  
import { queries } from '../db/queries.js';

export async function createUser(payload) {
  const { role, email, password_hash, first_name, last_name, student_number, teacher_number } = payload;
  const { rows } = await pool.query(queries.createUser, [
    role, email, password_hash, first_name, last_name, student_number, teacher_number,
  ]);
  return rows[0];
}

export async function updateUser({ id, email, first_name, last_name, student_number, teacher_number }) {
  const { rows } = await pool.query(queries.updateUser, [
    id, email, first_name, last_name, student_number, teacher_number,
  ]);
  return rows[0];
}

export async function getUser(id) {
  const { rows } = await pool.query(queries.getUser, [id]);
  return rows[0];
}

export async function listUsers({ limit, offset }) {
  const { rows } = await pool.query(queries.listUsers, [limit ?? null, offset ?? null]);
  return rows;
}

export async function searchUsers(q) {
  const { rows } = await pool.query(queries.searchUsers, [q ?? null]);
  return rows;
}

export async function deleteUser(id) {
  await pool.query(queries.deleteUser, [id]);
  return { ok: true };
}

