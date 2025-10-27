import pool from "../db/pool.js";
import { queries } from "../db/queries.js";

export async function registerStudent({
  email,
  password_hash,
  first_name,
  last_name,
  student_number,
}) {
  const { rows } = await pool.query(queries.registerStudent, [
    email,
    password_hash,
    first_name,
    last_name,
    student_number,
  ]);
  return rows[0];
}

export async function findFacultyWhitelist(email, teacher_number) {
  const { rows } = await pool.query(queries.findFacultyWhitelist, [
    email,
    teacher_number,
  ]);
  return rows[0];
}

export async function registerTeacherFromWhitelist({
  email,
  password_hash,
  first_name,
  last_name,
  teacher_number,
}) {
  const { rows } = await pool.query(queries.registerTeacherFromWhitelist, [
    email,
    password_hash,
    first_name,
    last_name,
    teacher_number,
  ]);
  return rows[0];
}

export async function findUserLogin(email) {
  const { rows } = await pool.query(queries.loginByEmail, [email]);
  return rows[0];
}

export async function getProfileById(id) {
  const { rows } = await pool.query(queries.getProfileById, [id]);
  return rows[0];
}

export async function beginReset(reset_token, email) {
  await pool.query(queries.beginReset, [reset_token, email]);
  return { ok: true };
}

export async function checkReset(reset_token) {
  const { rows } = await pool.query(queries.checkReset, [reset_token]);
  return rows[0];
}

export async function finishReset({ id, password_hash }) {
  await pool.query(queries.finishReset, [password_hash, id]);
  return { ok: true };
}
