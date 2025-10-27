import crypto from "crypto";
import { hashPassword, verifyPassword } from "../utils/passwords.js";
import { signJwt } from "../utils/tokens.js";
import * as auth from "../services/auth.services.js";

export async function registerStudent(req, res, next) {
  try {
    const { email, password, first_name, last_name, student_number } = req.body;
    const password_hash = await hashPassword(password);
    const row = await auth.registerStudent({
      email,
      password_hash,
      first_name,
      last_name,
      student_number,
    });
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
}

export async function registerTeacher(req, res, next) {
  try {
    const { email, password, teacher_number } = req.body;
    const wl = await auth.findFacultyWhitelist(email, teacher_number);
    if (!wl || wl.active !== true)
      return res
        .status(400)
        .json({ message: "Not on active faculty whitelist" });

    const password_hash = await hashPassword(password);
    const row = await auth.registerTeacherFromWhitelist({
      email,
      password_hash,
      first_name: wl.first_name,
      last_name: wl.last_name,
      teacher_number,
    });
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await auth.findUserLogin(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signJwt({ id: user.id, role: user.role });

    const cookieOptions = {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    };

    res.cookie("access", token, cookieOptions);
    const profile = await auth.getProfileById(String(user.id));
    res.json({ profile });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const idStr = req.user?.id;
    if (!idStr || !/^\d+$/.test(String(idStr))) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await auth.getProfileById(String(idStr));
    return res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function beginReset(req, res, next) {
  try {
    const { email } = req.body;
    const token = crypto.randomBytes(24).toString("hex");
    await auth.beginReset(token, email);
    res.json({ ok: true, token });
  } catch (err) {
    next(err);
  }
}

export async function checkReset(req, res, next) {
  try {
    const { token } = req.body;
    const row = await auth.checkReset(token);
    res.json({ ok: !!row, id: row?.id ?? null });
  } catch (err) {
    next(err);
  }
}

export async function finishReset(req, res, next) {
  try {
    const { token, new_password } = req.body;
    const row = await auth.checkReset(token);
    if (!row)
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });

    const password_hash = await hashPassword(new_password);
    await auth.finishReset({ id: row.id, password_hash });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
}
