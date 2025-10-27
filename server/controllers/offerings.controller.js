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
