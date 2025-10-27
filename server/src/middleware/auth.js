import { verifyJwt } from "../utils/tokens.js";

export function requireAuth(req, res, next) {
  const token = req.cookies?.access;
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    const p = verifyJwt(token);
    const id = p.sub ?? p.id;
    if (!id) return res.status(401).json({ message: "Invalid token" });
    req.user = { ...p, id, role: p.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}