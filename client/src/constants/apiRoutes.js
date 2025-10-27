import { ENV } from "../config/env";
export const API_BASE = ENV.API_URL.replace(/\/$/, "");

const url = (path, params = {}, query = {}) => {
  const out = path.replace(/:([A-Za-z_]+)/g, (_, k) => {
    const v = params[k];
    if (v == null) throw new Error(`Missing param :${k} for ${path}`);
    return encodeURIComponent(v);
  });
  const q = Object.entries(query)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return `${API_BASE}${out}${q ? "?" + q : ""}`;
};

export const routes = {
  auth: {
    registerStudent: () => ({
      method: "POST",
      url: url("/auth/register/student"),
    }),
    registerTeacher: () => ({
      method: "POST",
      url: url("/auth/register/teacher"),
    }),
    login: () => ({ method: "POST", url: url("/auth/login") }),
    me: () => ({ method: "GET", url: url("/auth/me") }),
    logout: () => ({ method: "POST", url: url("/auth/logout") }),
    resetBegin: () => ({ method: "POST", url: url("/auth/reset/begin") }),
    resetCheck: () => ({ method: "POST", url: url("/auth/reset/check") }),
    resetFinish: () => ({ method: "POST", url: url("/auth/reset/finish") }),
  },

  users: {
    list: () => ({ method: "GET", url: url("/users") }),
    search: (q) => ({ method: "GET", url: url("/users/search", {}, { q }) }),
    create: () => ({ method: "POST", url: url("/users") }),
    get: (id) => ({ method: "GET", url: url("/users/:id", { id }) }),
    update: (id) => ({ method: "PATCH", url: url("/users/:id", { id }) }),
    remove: (id) => ({ method: "DELETE", url: url("/users/:id", { id }) }),
    listMajors: (id) => ({
      method: "GET",
      url: url("/users/:id/majors", { id }),
    }),
    addMajor: (id) => ({
      method: "POST",
      url: url("/users/:id/majors", { id }),
    }),
    removeMajor: (id, code) => ({
      method: "DELETE",
      url: url("/users/:id/majors/:code", { id, code }),
    }),
    addMajorsBulk: (id) => ({
      method: "POST",
      url: url("/users/:id/majors/bulk", { id }),
    }),
    replaceMajors: (id) => ({
      method: "PUT",
      url: url("/users/:id/majors", { id }),
    }),
    listAllMajors: () => ({ method: "GET", url: url("/users/majors/all") }),
    listAllTerms: () => ({ method: "GET", url: url("/users/terms/all") }),
    getCurrentTerm: () => ({ method: "GET", url: url("/users/terms/current") }),
    getNextTerm: () => ({ method: "GET", url: url("/users/terms/next") }),
  },

  courses: {
    list: () => ({ method: "GET", url: url("/courses") }),
    withOfferings: () => ({
      method: "GET",
      url: url("/courses/with-offerings"),
    }),
    byId: (id) => ({ method: "GET", url: url("/courses/:id", { id }) }),
    courseIdByCode: (code) => ({
      method: "GET",
      url: url("/courses/code/:code/id", { code }),
    }),
  },

  offerings: {
    create: () => ({ method: "POST", url: url("/offerings") }),
    update: (id) => ({ method: "PATCH", url: url("/offerings/:id", { id }) }),
    remove: (id) => ({ method: "DELETE", url: url("/offerings/:id", { id }) }),
    filter: (opts = {}) => ({
      method: "GET",
      url: url("/offerings/filter", {}, opts),
    }),
    eligibleForStudent: (id, studentId) => ({
      method: "GET",
      url: url("/offerings/:id/eligible/:studentId", { id, studentId }),
    }),
    find: (id) => ({ method: "GET", url: url("/offerings/:id", { id }) }),
    my: () => ({ method: "GET", url: url("/offerings/my") }),
    listWithSeats: () => ({ method: "GET", url: url("/offerings") }),

    hasPassedCourse: (studentId, courseId) => ({
      method: "GET",
      url: url(
        "/offerings/eligibility/passed",
        {},
        { student_id: studentId, course_id: courseId }
      ),
    }),
    allPrereqsMet: (studentId, courseId) => ({
      method: "GET",
      url: url(
        "/offerings/eligibility/prereqs",
        {},
        { student_id: studentId, course_id: courseId }
      ),
    }),
    addPrereq: (offeringId) => ({
      method: "POST",
      url: url("/offerings/:offeringId/prereqs", { offeringId }),
    }),
    removePrereq: (offeringId, prereqOfferingId) => ({
      method: "DELETE",
      url: url("/offerings/:offeringId/prereqs/:prereqOfferingId", {
        offeringId,
        prereqOfferingId,
      }),
    }),
    searchClassmates: (offeringId, q) => ({
      method: "GET",
      url: url(
        "/offerings/:offeringId/classmates/search",
        { offeringId },
        { q }
      ),
    }),
    listOfferingsForCourse: (courseId) => ({
      method: "GET",
      url: url("/offerings/course/:courseId", { courseId }),
    }),
  },

  enrollments: {
    requestWaitlist: () => ({
      method: "POST",
      url: url("/enrollments/waitlist"),
    }),
    cancelWaitlist: () => ({
      method: "DELETE",
      url: url("/enrollments/waitlist"),
    }),
    approve: () => ({ method: "POST", url: url("/enrollments/approve") }),
    deny: () => ({ method: "POST", url: url("/enrollments/deny") }),
    drop: () => ({ method: "POST", url: url("/enrollments/drop") }),
    complete: () => ({ method: "POST", url: url("/enrollments/complete") }),
    listWaitlist: (offeringId) => ({
      method: "GET",
      url: url("/enrollments/:offeringId/waitlist", { offeringId }),
    }),
    seatsLeft: (offeringId) => ({
      method: "GET",
      url: url("/enrollments/:offeringId/seats-left", { offeringId }),
    }),
    listEnrolled: (offeringId) => ({
      method: "GET",
      url: url("/enrollments/:offeringId/enrolled", { offeringId }),
    }),
  },

  assignments: {
    create: () => ({ method: "POST", url: url("/assignments") }),
    update: (id) => ({ method: "PATCH", url: url("/assignments/:id", { id }) }),
    remove: (id) => ({
      method: "DELETE",
      url: url("/assignments/:id", { id }),
    }),
    open: (id) => ({
      method: "PATCH",
      url: url("/assignments/:id/open", { id }),
    }),
    close: (id) => ({
      method: "PATCH",
      url: url("/assignments/:id/close", { id }),
    }),
    get: (id) => ({ method: "GET", url: url("/assignments/:id", { id }) }),
    listForOffering: (offeringId) => ({
      method: "GET",
      url: url("/assignments/offering/:offeringId", { offeringId }),
    }),
  },

  submissions: {
    submitOrResubmit: () => ({ method: "POST", url: url("/submissions") }),
    submitGrade: () => ({ method: "POST", url: url("/submissions/grade") }),
    listAllForTeacher: () => ({
      method: "GET",
      url: url("/submissions/teacher/all"),
    }),
    listForOffering: (offeringId) => ({
      method: "GET",
      url: url("/submissions/offering/:offeringId", { offeringId }),
    }),
    mySubmissions: (offeringId) => ({
      method: "GET",
      url: url("/submissions/my/:offeringId", { offeringId }),
    }),
  },

  grades: {
    breakdown: (offeringId) => ({
      method: "GET",
      url: url("/grades/:offeringId/breakdown", { offeringId }),
    }),
    current: (offeringId) => ({
      method: "GET",
      url: url("/grades/:offeringId/current", { offeringId }),
    }),
    finals: () => ({ method: "GET", url: url("/grades/finals") }),
    gpaByCourse: () => ({ method: "GET", url: url("/grades/gpa/by-course") }),
    gpaCumulative: () => ({
      method: "GET",
      url: url("/grades/gpa/cumulative"),
    }),
    updateFinal: () => ({
      method: "PATCH",
      url: url("/grades/final"),
    }),
  },

  materials: {
    add: () => ({ method: "POST", url: url("/materials") }),
    remove: (id) => ({ method: "DELETE", url: url("/materials/:id", { id }) }),
    listForOffering: (offeringId) => ({
      method: "GET",
      url: url("/materials/:offeringId", { offeringId }),
    }),
  },
};

export default routes;
