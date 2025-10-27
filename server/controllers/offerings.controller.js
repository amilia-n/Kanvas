import * as offerings from "../services/offerings.services.js";
import * as users from "../services/users.services.js";

async function requireOfferingOwner(req, offeringId) {
  const row = await offerings.findOffering(offeringId);
  if (!row) return { ok: false, code: 404, message: "Offering not found" };
  if (req.user.role !== "admin" && row.teacher_id !== req.user.id) {
    return { ok: false, code: 403, message: "Forbidden" };
  }
  return { ok: true, row };
}

export async function createOffering(req, res, next) {
  try {
    const data = {
      ...req.body,
      teacher_id: req.user.id,  
    };
    const offering = await offerings.createOffering(data);  
    res.status(201).json(offering);
  } catch (err) {
    next(err);
  }
}

export async function updateOffering(req, res, next) {
  try {
    const id = Number(req.params.id);
    const gate = await requireOfferingOwner(req, id);
    if (!gate.ok) return res.status(gate.code).json({ message: gate.message });

    const row = await offerings.updateOffering(id, req.body);
    res.json(row);
  } catch (err) { next(err); }
}

export async function deleteOffering(req, res, next) {
  try {
    const id = Number(req.params.id);
    const gate = await requireOfferingOwner(req, id);
    if (!gate.ok) return res.status(gate.code).json({ message: gate.message });

    await offerings.deleteOffering(id);
    res.status(204).end();
  } catch (err) { next(err); }
}

