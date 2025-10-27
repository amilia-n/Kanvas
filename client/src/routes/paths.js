export const paths = Object.freeze({
  home: "/",

  login: "/login",
  logout: "/logout",
  reset: "/reset-password",

  me: "/me",
  myOfferings: "/my-offerings",

  courseMaterial: (offeringId = ":offeringId") =>
    `/offerings/${offeringId}/classroom`,

  courses: "/courses",
  course: (id = ":id") => `/courses/${id}`,

  offerings: "/offerings",
  offering: (id = ":id") => `/offerings/${id}`,

  assignments: "/assignments",
  assignment: (id = ":id") => `/assignments/${id}`,
  offeringAssignments: (offeringId = ":offeringId") =>
    `/offerings/${offeringId}/assignments`,

  submissions: "/submissions",
  offeringSubmissions: (offeringId = ":offeringId") =>
    `/offerings/${offeringId}/submissions`,

  grades: "/grades",

  enrollmentManage: "/enrollments/manage",

  admin: {
    users: "/admin/users",
    user: (id = ":id") => `/admin/users/${id}`,
  },

  forbidden: "/forbidden",
  notFound: "*",
});

export function fillPath(pattern, params = {}) {
  return pattern.replace(/:([A-Za-z_]+)/g, (_, k) => {
    const v = params[k];
    if (v == null) throw new Error(`Missing param :${k} for ${pattern}`);
    return encodeURIComponent(String(v));
  });
}
