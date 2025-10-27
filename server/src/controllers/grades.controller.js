import * as grades from "../services/grades.services.js";
import * as offerings from "../services/offerings.services.js";

function parseNum(n) {
  const v = Number(n);
  return Number.isFinite(v) ? v : null;
}

export async function courseGradeBreakdown(req, res, next) {
  try {
    const offering_id = parseNum(req.params.offeringId);
    if (offering_id == null)
      return res.status(400).json({ message: "offeringId must be a number" });

    const canPickStudent =
      req.user.role === "teacher" || req.user.role === "admin";
    const student_id = canPickStudent
      ? parseNum(req.query.studentId) ?? null
      : req.user.id;
    if (canPickStudent && student_id == null) {
      return res.status(400).json({ message: "studentId must be a number" });
    }

    if (req.user.role === "teacher") {
      const off = await offerings.findOffering(offering_id);
      if (!off) return res.status(404).json({ message: "Offering not found" });
      if (off.teacher_id !== req.user.id)
        return res.status(403).json({ message: "Forbidden" });
    }

    const rows = await grades.courseGradeBreakdown(student_id, offering_id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function currentWeightedGrade(req, res, next) {
  try {
    const offering_id = parseNum(req.params.offeringId);
    if (offering_id == null)
      return res.status(400).json({ message: "offeringId must be a number" });

    const canPickStudent =
      req.user.role === "teacher" || req.user.role === "admin";
    const student_id = canPickStudent
      ? parseNum(req.query.studentId) ?? null
      : req.user.id;
    if (canPickStudent && student_id == null) {
      return res.status(400).json({ message: "studentId must be a number" });
    }

    if (req.user.role === "teacher") {
      const off = await offerings.findOffering(offering_id);
      if (!off) return res.status(404).json({ message: "Offering not found" });
      if (off.teacher_id !== req.user.id)
        return res.status(403).json({ message: "Forbidden" });
    }

    const row = await grades.currentWeightedGrade(student_id, offering_id);
    res.json(row ?? { student_id, current_weighted_percent: null });
  } catch (err) {
    next(err);
  }
}

export async function finalPercentPerCourseCompleted(req, res, next) {
  try {
    const qId = parseNum(req.query.studentId);
    if (qId != null && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const student_id = qId ?? req.user.id;

    const rows = await grades.finalPercentPerCourseCompleted(student_id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function gpaPerCourse(req, res, next) {
  try {
    const qId = parseNum(req.query.studentId);
    if (qId != null && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const student_id = qId ?? req.user.id;

    const rows = await grades.gpaPerCourse(student_id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function cumulativeGPA(req, res, next) {
  try {
    const qId = parseNum(req.query.studentId);
    if (qId != null && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const student_id = qId ?? req.user.id;

    const row = await grades.cumulativeGPA(student_id);
    res.json(row ?? { cumulative_gpa: null, total_credits: 0 });
  } catch (err) {
    next(err);
  }
}

export async function updateFinalGrade(req, res, next) {
  try {
    const { offering_id, student_id, final_percent } = req.body;

    if (!offering_id || !student_id || final_percent == null) {
      return res.status(400).json({
        message: "offering_id, student_id, and final_percent required",
      });
    }

    const off = await offerings.findOffering(Number(offering_id));
    if (!off) {
      return res.status(404).json({ message: "Offering not found" });
    }
    if (req.user.role !== "admin" && off.teacher_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const percent = Number(final_percent);
    if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
      return res.status(400).json({
        message: "final_percent must be between 0 and 100",
      });
    }

    const row = await grades.updateFinalGrade(
      Number(offering_id),
      Number(student_id),
      percent
    );

    if (!row) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json(row);
  } catch (err) {
    next(err);
  }
}
