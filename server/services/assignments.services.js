import pool from "../db/pool.js";
import { queries } from "../db/queries.js";

export async function createAssignment({
  offering_id,
  title,
  description,
  weight_percent,
  due_at,
}) {
  const { rows } = await pool.query(queries.createAssignment, [
    offering_id,
    title,
    description ?? null,
    weight_percent,
    due_at,
  ]);
  return rows[0];
}

export async function findAssignment(id) {
  const { rows } = await pool.query(queries.findAssignment, [id]);
  return rows[0] ?? null;
}

export async function updateAssignment(
  id,
  { title, description, weight_percent, due_at, is_open }
) {
  const { rows } = await pool.query(queries.updateAssignment, [
    id,
    title ?? null,
    description ?? null,
    weight_percent ?? null,
    due_at ?? null,
    is_open ?? null,
  ]);
  return rows[0] ?? null;
}

export async function deleteAssignment(id) {
  await pool.query(queries.deleteAssignment, [id]);
  return { ok: true };
}

export async function setAssignmentOpen(id, is_open) {
  const { rows } = await pool.query(queries.setAssignmentOpen, [id, is_open]);
  return rows[0] ?? null;
}

export async function listForOffering(offering_id) {
  const { rows } = await pool.query(queries.listAssignmentsForOffering, [
    offering_id,
  ]);
  return rows;
}

export async function getAssignmentById(id) {
  const { rows } = await pool.query(queries.getAssignmentById, [id]);
  return rows[0] || null;
}
