export const ENROLLMENT = Object.freeze({
  WAITLISTED: "waitlisted",
  ENROLLED: "enrolled",
  DROPPED: "dropped",
  DENIED: "denied",
  COMPLETED: "completed",
});

export const isActive = (s) =>
  s === ENROLLMENT.ENROLLED || s === ENROLLMENT.WAITLISTED;

export const statusLabel = (s) =>
  ({
    [ENROLLMENT.WAITLISTED]: "Waitlisted",
    [ENROLLMENT.ENROLLED]: "Enrolled",
    [ENROLLMENT.DROPPED]: "Dropped",
    [ENROLLMENT.DENIED]: "Denied",
    [ENROLLMENT.COMPLETED]: "Completed",
  }[s] || "Unknown");
