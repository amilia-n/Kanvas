export const ROLES = Object.freeze({
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin",
});

export const isTeacherOrAdmin = (role) =>
  role === ROLES.TEACHER || role === ROLES.ADMIN;

export const roleLabel = (role) =>
  ({ student: "Student", teacher: "Teacher", admin: "Admin" }[role] || "User");
