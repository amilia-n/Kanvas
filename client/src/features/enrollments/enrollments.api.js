import { routes } from "../../constants/apiRoutes";
import apiClient from "../../lib/apiClient";

export const requestWaitlist = (offeringId) => {
  const { method, url } = routes.enrollments.requestWaitlist();
  return apiClient({ method, url, data: { offering_id: offeringId } });
};

export const cancelWaitlist = (offeringId) => {
  const { method, url } = routes.enrollments.cancelWaitlist();
  return apiClient({ method, url, data: { offering_id: offeringId } });
};

export const approveEnrollment = (offeringId, studentId) => {
  const { method, url } = routes.enrollments.approve();
  return apiClient({ method, url, data: { offering_id: offeringId, student_id: studentId } });
};

export const denyEnrollment = (offeringId, studentId) => {
  const { method, url } = routes.enrollments.deny();
  return apiClient({ method, url, data: { offering_id: offeringId, student_id: studentId } });
};

export const dropEnrollment = (offeringId, studentId) => {
  const { method, url } = routes.enrollments.drop();
  return apiClient({ method, url, data: { offering_id: offeringId, student_id: studentId } });
};

export const completeEnrollment = (offeringId, studentId) => {
  const { method, url } = routes.enrollments.complete();
  return apiClient({ method, url, data: { offering_id: offeringId, student_id: studentId } });
};

export const listWaitlist = (offeringId) => {
  const { method, url } = routes.enrollments.listWaitlist(offeringId);
  return apiClient({ method, url });
};

export const seatsLeft = (offeringId) => {
  const { method, url } = routes.enrollments.seatsLeft(offeringId);
  return apiClient({ method, url });
};

export const listEnrolled = (offeringId) => {
  const { method, url } = routes.enrollments.listEnrolled(offeringId);
  return apiClient({ method, url });
};