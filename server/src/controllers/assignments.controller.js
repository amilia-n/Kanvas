import * as offerings from "../services/offerings.services.js";
import * as assignments from "../services/assignments.services.js";

async function requireAssignmentOwner(req, assignmentId) {
  const a = await assignments.findAssignment(Number(assignmentId));
  if (!a) return { ok: false, code: 404, message: "Assignment not found" };
  const off = await offerings.findOffering(Number(a.offering_id));
  if (!off) return { ok: false, code: 404, message: "Offering not found" };
  if (req.user.role !== "admin" && off.teacher_id !== req.user.id) {
    return { ok: false, code: 403, message: "Forbidden" };
  }
  return { ok: true, assignment: a, offering: off };
}

export async function createAssignment(req, res, next) {
  try {
    const { offering_id, title, description, weight_percent, due_at } =
      req.body;
    const off = await offerings.findOffering(Number(offering_id));
    if (!off) return res.status(404).json({ message: "Offering not found" });
    if (req.user.role !== "admin" && off.teacher_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const row = await assignments.createAssignment({
      offering_id,
      title,
      description,
      weight_percent,
      due_at,
    });
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
}

export async function updateAssignment(req, res, next) {
  try {
    const id = Number(req.params.id);
    const gate = await requireAssignmentOwner(req, id);
    if (!gate.ok) return res.status(gate.code).json({ message: gate.message });

    const row = await assignments.updateAssignment(id, req.body);
    if (!row) return res.status(404).json({ message: "Assignment not found" });
    res.json(row);
  } catch (err) {
    next(err);
  }
}

export async function deleteAssignment(req, res, next) {
  try {
    const id = Number(req.params.id);
    const gate = await requireAssignmentOwner(req, id);
    if (!gate.ok) return res.status(gate.code).json({ message: gate.message });

    await assignments.deleteAssignment(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function openSubmissions(req, res, next) {
  try {
    const id = Number(req.params.id);
    const gate = await requireAssignmentOwner(req, id);
    if (!gate.ok) return res.status(gate.code).json({ message: gate.message });

    const row = await assignments.setAssignmentOpen(id, true);
    res.json(row);
  } catch (err) {
    next(err);
  }
}

export async function closeSubmissions(req, res, next) {
  try {
    const id = Number(req.params.id);
    const gate = await requireAssignmentOwner(req, id);
    if (!gate.ok) return res.status(gate.code).json({ message: gate.message });

    const row = await assignments.setAssignmentOpen(id, false);
    res.json(row);
  } catch (err) {
    next(err);
  }
}

export async function listForOffering(req, res, next) {
  try {
    const offeringId = Number(req.params.offeringId);
    const off = await offerings.findOffering(offeringId);
    if (!off) return res.status(404).json({ message: "Offering not found" });

    if (req.user.role !== "admin" && off.teacher_id !== req.user.id) {
      const allowed = await offerings.isUserInOffering(offeringId, req.user.id);
      if (!allowed) return res.status(403).json({ message: "Forbidden" });
    }

    const rows = await assignments.listForOffering(offeringId);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function getAssignmentById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const assignment = await assignments.getAssignmentById(id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json(assignment);
  } catch (err) {
    next(err);
  }
}
