import * as courses from "../services/courses.services.js";

export async function getCourseById(req, res, next) {
  try {
    const row = await courses.getCourse(req.params.id);
    if (!row) return res.status(404).json({ message: "Course not found" });
    res.json(row);
  } catch (err) { next(err); }
}

export async function getCourseIdByCode(req, res, next) {
  try {
    const row = await courses.getCourseIdByCode(req.params.code); 
    if (!row) return res.status(404).json({ message: "Course not found" });
    res.json(row); 
  } catch (err) { next(err); }
}

export async function listCourses(_req, res, next) {
  try {
    const rows = await courses.listCourses();
    res.json(rows);
  } catch (err) { next(err); }
}

export async function listCoursesWithOfferings(_req, res, next) {
  try {
    const rows = await courses.listCoursesWithOfferings();
    res.json(rows);
  } catch (err) { next(err); }
}
