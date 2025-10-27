import { ROLES } from "../constants/roles";

export const hasRole = (user, ...roles) =>
  !!user && roles.includes(user.role);

export const canManageOffering = (user, offering) =>
  hasRole(user, ROLES.ADMIN) ||
  (hasRole(user, ROLES.TEACHER) && offering?.teacher_id === user?.id);

export const canManageCourse = (user) =>
  hasRole(user, ROLES.ADMIN, ROLES.TEACHER);

export const canManageUsers = (user) => hasRole(user, ROLES.ADMIN);

export const canEditUser = (user, targetUserId) =>
  hasRole(user, ROLES.ADMIN) || user?.id === targetUserId;

export const canGrade = (user, offering) =>
  hasRole(user, ROLES.ADMIN) ||
  (hasRole(user, ROLES.TEACHER) && offering?.teacher_id === user?.id);

export const isStudent = (user) => hasRole(user, ROLES.STUDENT);
