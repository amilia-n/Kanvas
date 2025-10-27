import pool from "../db/pool.js";
import { queries } from "../db/queries.js";

export async function requestWaitlist(offering_id, student_id) {
  const { rows } = await pool.query(queries.requestWaitlist, [
    offering_id,
    student_id,
  ]);
  return rows[0];
}

export async function selfCancelWaitlist(offering_id, student_id) {
  const { rows } = await pool.query(queries.selfCancelWaitlist, [
    offering_id,
    student_id,
  ]);
  return rows[0];
}

export async function approveFromWaitlist(offering_id, student_id) {
  const { rows } = await pool.query(queries.approveFromWaitlist, [
    offering_id,
    student_id,
  ]);
  return rows[0];
}

export async function denyWaitlist(offering_id, student_id) {
  const { rows } = await pool.query(queries.denyWaitlist, [
    offering_id,
    student_id,
  ]);
  return rows[0];
}

export async function dropEnrollment(offering_id, student_id) {
  const { rows } = await pool.query(queries.dropEnrollment, [
    offering_id,
    student_id,
  ]);
  return rows[0];
}

export async function markCompleted(offering_id, student_id) {
  const { rows } = await pool.query(queries.markCompleted, [
    offering_id,
    student_id,
  ]);
  return rows[0];
}

export async function listWaitlist(offering_id) {
  const { rows } = await pool.query(queries.listWaitlist, [offering_id]);
  return rows;
}

export async function seatsLeft(offering_id) {
  const { rows } = await pool.query(queries.seatsLeft, [offering_id]);
  return rows[0];
}

export async function listEnrolled(offering_id) {
  const { rows } = await pool.query(queries.listEnrolled, [offering_id]);
  return rows;
}
