import { routes } from "../../constants/apiRoutes";
import apiClient from "../../lib/apiClient";

export const listCourses = () => {
  const { method, url } = routes.courses.list();
  return apiClient({ method, url });
};

export const listCoursesWithOfferings = () => {
  const { method, url } = routes.courses.withOfferings();
  return apiClient({ method, url });
}

export const getCourse = (id) => {
  const { method, url } = routes.courses.byId(id);
  return apiClient({ method, url });
};

export const getCourseIdByCode = (code) => {
  const { method, url } = routes.courses.courseIdByCode(code);
  return apiClient({ method, url });
};

