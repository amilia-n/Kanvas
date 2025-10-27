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