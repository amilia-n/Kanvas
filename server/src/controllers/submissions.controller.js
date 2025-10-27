import * as submissions from "../services/submissions.services.js";
import * as offerings from "../services/offerings.services.js";

export async function submitOrResubmit(req, res, next) {
  try {
    const { assignment_id, submission_url } = req.body;
    const student_id = req.user.id;

    if (!assignment_id || !submission_url) {
      return res
        .status(400)
        .json({ message: "assignment_id and submission_url required" });
    }

    const result = await submissions.submitOrResubmit({
      assignment_id,
      student_id,
      submission_url,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function submitGrade(req, res, next) {
  try {
    const { grade_percent, assignment_id, student_id } = req.body;
    const graded_by = req.user.id;

    if (grade_percent == null || !assignment_id || !student_id) {
      return res
        .status(400)
        .json({
          message: "grade_percent, assignment_id, and student_id required",
        });
    }

    const assignment = await submissions.getAssignmentTeacher(assignment_id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    if (req.user.role !== "admin" && assignment.teacher_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await submissions.submitGrade({
      grade_percent,
      assignment_id,
      student_id,
      graded_by,
    });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function listSubmissionsForOffering(req, res, next) {
  try {
    const offeringId = Number(req.params.offeringId);

    const offering = await offerings.findOffering(offeringId);
    if (!offering) {
      return res.status(404).json({ message: "Offering not found" });
    }
    if (req.user.role !== "admin" && offering.teacher_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const submissionList = await submissions.listSubmissionsForOffering(
      offeringId
    );
    res.json(submissionList);
  } catch (err) {
    next(err);
  }
}

export async function getMySubmissions(req, res, next) {
  try {
    const offeringId = Number(req.params.offeringId);
    const studentId = req.user.id;

    const submissionList = await submissions.getMySubmissions(
      offeringId,
      studentId
    );
    res.json(submissionList);
  } catch (err) {
    next(err);
  }
}

export async function listAllSubmissionsForTeacher(req, res, next) {
  try {
    const teacherId = req.user.id;

    const submissionList = await submissions.listAllSubmissionsForTeacher(
      teacherId
    );
    res.json(submissionList);
  } catch (err) {
    next(err);
  }
}
