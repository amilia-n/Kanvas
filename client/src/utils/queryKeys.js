const num = (v) => (v === undefined || v === null ? undefined : Number(v));
const str = (v) => (v === undefined || v === null ? "" : String(v));
const canon = (obj = {}) => {
  const pairs = Object.entries(obj).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  pairs.sort(([a], [b]) => a.localeCompare(b));
  return pairs;
};

export const queryKeys = {
  auth: {
    me: () => ["auth", "me"],
  },
  users: {
    list: (opts = {}) => [
      "users",
      "list",
      canon({ limit: num(opts.limit), offset: num(opts.offset) }),
    ],
    detail: (id) => ["users", "detail", num(id)],
    majors: (id) => ["users", "majors", num(id)],
    search: (q) => ["users", "search", str(q)],
  },
  courses: {
    all: () => ["courses"],
    list: () => ["courses"],
    detail: (id) => ["courses", "detail", num(id)],
    byCode: (code) => ["courses", "byCode", str(code)],
  },
  offerings: {
    all: () => ["offerings"],
    withSeats: () => ["offerings", "withSeats"],
    byCourse: (courseId) => ["offerings", "byCourse", num(courseId)],
    detail: (id) => ["offerings", "detail", num(id)],
    filter: (filters = {}) => [
      "offerings",
      "filter",
      canon({
        termId: num(filters.termId),
        teacherId: num(filters.teacherId),
        q: str(filters.q),
        section: str(filters.section),
        limit: num(filters.limit),
        offset: num(filters.offset),
      }),
    ],
    eligible: (offeringId, studentId) => [
      "offerings",
      "eligible",
      num(offeringId),
      num(studentId),
    ],
    hasPassed: (studentId, courseId) => [
      "offerings",
      "eligibility",
      "passed",
      num(studentId),
      num(courseId),
    ],
    prereqsMet: (studentId, courseId) => [
      "offerings",
      "eligibility",
      "prereqs",
      num(studentId),
      num(courseId),
    ],
    classmatesSearch: (offeringId, q) => [
      "offerings",
      "classmates",
      num(offeringId),
      str(q),
    ],
  },
  enrollments: {
    waitlist: (offeringId) => ["enrollments", "waitlist", num(offeringId)],
    seatsLeft: (offeringId) => ["enrollments", "seatsLeft", num(offeringId)],
  },
  assignments: {
    root: () => ["assignments"],
    byOffering: (offeringId) => ["assignments", "byOffering", num(offeringId)],
    detail: (assignmentId) => [
      ...queryKeys.assignments.root(),
      "detail",
      assignmentId,
    ],
  },
  materials: {
    byOffering: (offeringId) => ["materials", "byOffering", num(offeringId)],
  },
  grades: {
    breakdown: (offeringId) => ["grades", "breakdown", num(offeringId)],
    current: (offeringId) => ["grades", "current", num(offeringId)],
    finals: () => ["grades", "finals"],
    gpaByCourse: () => ["grades", "gpaByCourse"],
    gpaCumulative: () => ["grades", "gpaCumulative"],
  },
  submissions: {
    root: () => ["submissions"],
  },
};

export default queryKeys;
