import * as materials from "../services/materials.services.js";
import * as offerings from "../services/offerings.services.js";

function parseNum(n) {
  const v = Number(n);
  return Number.isFinite(v) ? v : null;
}

export async function addMaterial(req, res, next) {
  try {
    const { offering_id, title, url } = req.body;
    const offId = parseNum(offering_id);
    if (offId == null)
      return res.status(400).json({ message: "offering_id must be a number" });
    if (!title || !url)
      return res.status(400).json({ message: "title and url are required" });

    const off = await offerings.findOffering(offId);
    if (!off) return res.status(404).json({ message: "Offering not found" });
    if (req.user.role !== "admin" && off.teacher_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const uploaded_by = req.user.id;
    const row = await materials.addMaterial({
      offering_id: offId,
      title,
      url,
      uploaded_by,
    });
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
}

export async function listMaterials(req, res, next) {
  try {
    const offering_id = parseNum(req.params.offeringId);
    if (offering_id == null)
      return res.status(400).json({ message: "offeringId must be a number" });

    const access = await materials.canViewMaterials(req.user.id, offering_id);
    if (!access?.ok) return res.status(403).json({ message: "Forbidden" });

    const rows = await materials.listMaterials(offering_id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function deleteMaterial(req, res, next) {
  try {
    const id = parseNum(req.params.id);
    if (id == null)
      return res.status(400).json({ message: "id must be a number" });

    const meta = await materials.findMaterialMeta(id);
    if (!meta) return res.status(404).json({ message: "Not found" });

    const isAdmin = req.user.role === "admin";
    const isOfferingTeacher = meta.teacher_id === req.user.id;

    if (!isAdmin && !isOfferingTeacher) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await materials.deleteMaterial(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
