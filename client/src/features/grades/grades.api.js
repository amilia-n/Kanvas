import { routes } from "../../constants/apiRoutes";
import apiClient from "../../lib/apiClient";

export const getBreakdown = (offeringId) => {
  const { method, url } = routes.grades.breakdown(offeringId);
  return apiClient({ method, url });
};

export const getCurrent = (offeringId) => {
  const { method, url } = routes.grades.current(offeringId);
  return apiClient({ method, url });
};

export const getFinals = () => {
  const { method, url } = routes.grades.finals();
  return apiClient({ method, url });
};

export const getGpaByCourse = () => {
  const { method, url } = routes.grades.gpaByCourse();
  return apiClient({ method, url });
};

export const getGpaCumulative = () => {
  const { method, url } = routes.grades.gpaCumulative();
  return apiClient({ method, url });
};

export const updateFinalGrade = (data) => {
  const { method, url } = routes.grades.updateFinal();
  return apiClient({ method, url, data });
};