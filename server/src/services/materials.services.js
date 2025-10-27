import pool from "../db/pool.js";
import { queries } from "../db/queries.js";

export async function addMaterial({ offering_id, title, url, uploaded_by }) {
  const { rows } = await pool.query(queries.addMaterial, [
    offering_id,
    title,
    url,
    uploaded_by,
  ]);
  return rows[0];
}

export async function listMaterials(offering_id) {
  const { rows } = await pool.query(queries.listMaterials, [offering_id]);
  return rows;
}

export async function deleteMaterial(id) {
  await pool.query(queries.deleteMaterial, [id]);
  return { ok: true };
}

export async function canViewMaterials(user_id, offering_id) {
  const { rows } = await pool.query(queries.canViewMaterials, [
    user_id,
    offering_id,
  ]);
  return rows[0];
}

export async function findMaterialMeta(id) {
  const { rows } = await pool.query(queries.findMaterialMeta, [id]);
  return rows[0];
}
