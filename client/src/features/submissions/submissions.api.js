import { routes } from "../../constants/apiRoutes";
import apiClient from "../../lib/apiClient";

export const submitOrResubmit = (data) => {
  const { method, url } = routes.submissions.submitOrResubmit();
  return apiClient({ method, url, data });
};

export const submitGrade = (data) => {
  const { method, url } = routes.submissions.submitGrade();
  return apiClient({ method, url, data });
};

export const listSubmissionsForOffering = (offeringId) => {
  const { method, url } = routes.submissions.listForOffering(offeringId);
  return apiClient({ method, url });
};

export const getMySubmissions = (offeringId) => {
  const { method, url } = routes.submissions.mySubmissions(offeringId);
  return apiClient({ method, url });
};

export const listAllSubmissionsForTeacher = () => {
  const { method, url } = routes.submissions.listAllForTeacher();
  return apiClient({ method, url });
};