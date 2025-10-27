import pool from "../db/pool.js";
import { queries } from "../db/queries.js";

export async function createUser(payload) {
  const {
    role,
    email,
    password_hash,
    first_name,
    last_name,
    student_number,
    teacher_number,
  } = payload;
  const { rows } = await pool.query(queries.createUser, [
    role,
    email,
    password_hash,
    first_name,
    last_name,
    student_number,
    teacher_number,
  ]);
  return rows[0];
}

export async function updateUser({
  id,
  email,
  first_name,
  last_name,
  student_number,
  teacher_number,
}) {
  const { rows } = await pool.query(queries.updateUser, [
    id,
    email,
    first_name,
    last_name,
    student_number,
    teacher_number,
  ]);
  return rows[0];
}

export async function getUser(id) {
  const { rows } = await pool.query(queries.getUser, [id]);
  return rows[0];
}

export async function listUsers({ limit, offset }) {
  const { rows } = await pool.query(queries.listUsers, [
    limit ?? null,
    offset ?? null,
  ]);
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

export async function listUserMajors(user_id) {
  const { rows } = await pool.query(queries.listUserMajors, [user_id]);
  return rows;
}

export async function addUserMajor(user_id, major_code) {
  await pool.query(queries.addUserMajor, [user_id, major_code]);
  return { ok: true };
}

export async function removeUserMajor(user_id, major_code) {
  await pool.query(queries.removeUserMajor, [user_id, major_code]);
  return { ok: true };
}

export async function addUserMajorsBulk(user_id, codes) {
  await pool.query(queries.addUserMajorsBulk, [user_id, codes]);
  return { ok: true };
}

export async function replaceUserMajors(user_id, codes) {
  await pool.query(queries.replaceUserMajors, [user_id, codes]);
  return { ok: true };
}

export async function listMajors() {
  const { rows } = await pool.query(queries.listMajors);
  return rows;
}

export async function listTerms() {
  const { rows } = await pool.query(queries.listTerms);
  return rows;
}

export async function findTermByCode(code) {
  const { rows } = await pool.query(queries.findTermByCode, [code]);
  return rows[0];
}

export async function getCurrentTerm() {
  const { rows } = await pool.query(queries.getCurrentTerm);
  return rows[0];
}

export async function getNextTerm() {
  const { rows } = await pool.query(queries.getNextTerm);
  return rows[0];
}

export async function searchOfferingClassmates(offering_id, q) {
  const { rows } = await pool.query(queries.searchOfferingClassmates, [
    offering_id,
    q,
  ]);
  return rows;
}
