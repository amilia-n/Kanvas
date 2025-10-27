import { hashPassword } from '../utils/passwords.js';
import * as users from "../services/users.services.js";

export async function createUser(req, res, next) {
  try {
    const { role, email, password, first_name, last_name, student_number, teacher_number } = req.body;
    const password_hash = await hashPassword(password);
    const row = await users.createUser({ role, email, password_hash, first_name, last_name, student_number, teacher_number });
    res.status(201).json(row);
  } catch (err) { next(err); }
}

export async function updateUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { email, first_name, last_name, student_number, teacher_number } = req.body;
    const row = await users.updateUser({ id, email, first_name, last_name, student_number, teacher_number });
    if (!row) return res.status(404).json({ message: "Not found" }); 
    res.json(row);
  } catch (err) { next(err); }
}

export async function getUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    const row = await users.getUser(id);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  } catch (err) { next(err); }
}

export async function listUsers(req, res, next) {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;
    const rows = await users.listUsers({ limit, offset });
    res.json(rows);
  } catch (err) { next(err); }
}

export async function searchUsers(req, res, next) {
  try {
    const q = req.query.q ?? null;
    const rows = await users.searchUsers(q);
    res.json(rows);
  } catch (err) { next(err); }
}

export async function deleteUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    await users.deleteUser(id);
    res.status(204).end();
  } catch (err) { next(err); }
}

export async function listUserMajors(req, res, next) {
  try {
    const id = Number(req.params.id);
    const majors = await users.listUserMajors(id);
    res.json(majors);
  } catch (err) { next(err); }
}

export async function addUserMajor(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { code } = req.body;
    await users.addUserMajor(id, code);
    res.status(201).json({ ok: true });
  } catch (err) { next(err); }
}

export async function removeUserMajor(req, res, next) {
  try {
    const id = Number(req.params.id);
    const code = req.params.code;
    await users.removeUserMajor(id, code);
    res.status(204).end();
  } catch (err) { next(err); }
}

export async function addUserMajorsBulk(req, res, next) {
  try {
    const id = Number(req.params.id);
    const codes = req.body.codes ?? [];
    await users.addUserMajorsBulk(id, codes);
    res.status(201).json({ ok: true });
  } catch (err) { next(err); }
}

export async function replaceUserMajors(req, res, next) {
  try {
    const id = Number(req.params.id);
    const codes = req.body.codes ?? [];
    await users.replaceUserMajors(id, codes);
    res.json({ ok: true });
  } catch (err) { next(err); }
}


export async function listAllMajors(req, res, next) {
  try {
    const majors = await users.listMajors();
    res.json(majors);
  } catch (err) {
    next(err);
  }
}