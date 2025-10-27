import * as enrollments from "../services/enrollments.services.js";
import * as offerings from "../services/offerings.services.js";

async function ensureTeacherOwnsOffering(req, offeringId) {
  const row = await offerings.findOffering(offeringId);
  if (!row) return { ok: false, code: 404, message: "Offering not found" };
  if (req.user.role !== "admin" && row.teacher_id !== req.user.id) {
    return { ok: false, code: 403, message: "Forbidden" };
  }
  return { ok: true };
}

export async function requestWaitlist(req, res, next) {
  try {
    const student_id = req.user.id;
    const { offering_id } = req.body;
    if (!offering_id)
      return res.status(400).json({ message: "offering_id required" });
    const row = await enrollments.requestWaitlist(offering_id, student_id);
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
}

export async function selfCancelWaitlist(req, res, next) {
  try {
    const student_id = req.user.id;
    const { offering_id } = req.body;
    const row = await enrollments.selfCancelWaitlist(offering_id, student_id);
    if (!row) return res.status(404).json({ message: "No waitlist entry" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function approveFromWaitlist(req, res, next) {
  try {
    const { offering_id, student_id } = req.body;
    const gate = await ensureTeacherOwnsOffering(req, Number(offering_id));
    if (!gate.ok) return res.status(gate.code).json({ message: gate.message });

    const row = await enrollments.approveFromWaitlist(offering_id, student_id);
    if (!row)
      return res
        .status(409)
        .json({ message: "No seat available or not on waitlist" });
    res.json(row);
  } catch (err) {
    next(err);
  }
}

export async function denyWaitlist(req, res, next) {
  try {
    const { offering_id, student_id } = req.body;
    const gate = await ensureTeacherOwnsOffering(req, Number(offering_id));
    if (!gate.ok) return res.status(gate.code).json({ message: gate.message });

    const row = await enrollments.denyWaitlist(offering_id, student_id);
    if (!row)
      return res.status(404).json({ message: "No waitlist entry to deny" });
    res.json(row);
  } catch (err) {
    next(err);
  }
}

export async function dropEnrollment(req, res, next) {
  try {
    const { offering_id, student_id } = req.body;
    const gate = await ensureTeacherOwnsOffering(req, Number(offering_id));
    if (!gate.ok) return res.status(gate.code).json({ message: gate.message });

    const row = await enrollments.dropEnrollment(offering_id, student_id);
    if (!row) return res.status(404).json({ message: "Not enrolled" });
    res.json(row);
  } catch (err) {
    next(err);
  }
}

export async function markCompleted(req, res, next) {
  try {
    const { offering_id, student_id } = req.body;
    const gate = await ensureTeacherOwnsOffering(req, Number(offering_id));
    if (!gate.ok) return res.status(gate.code).json({ message: gate.message });

    const row = await enrollments.markCompleted(offering_id, student_id);
    res.json(row ?? { id: null });
  } catch (err) {
    next(err);
  }
}

export async function listWaitlist(req, res, next) {
  try {
    const offering_id = Number(req.params.offeringId);
    const gate = await ensureTeacherOwnsOffering(req, offering_id);
    if (!gate.ok) return res.status(gate.code).json({ message: gate.message });

    const rows = await enrollments.listWaitlist(offering_id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function seatsLeft(req, res, next) {
  try {
    const offering_id = Number(req.params.offeringId);
    if (!Number.isFinite(offering_id))
      return res.status(400).json({ message: "offeringId required" });

    const row = await enrollments.seatsLeft(offering_id);
    res.json(row ?? { offering_id, seats_left: null });
  } catch (err) {
    next(err);
  }
}

export async function listEnrolled(req, res, next) {
  try {
    const offering_id = Number(req.params.offeringId);
    const gate = await ensureTeacherOwnsOffering(req, offering_id);
    if (!gate.ok) return res.status(gate.code).json({ message: gate.message });

    const rows = await enrollments.listEnrolled(offering_id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}
