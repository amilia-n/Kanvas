import { routes } from "../../constants/apiRoutes";
import apiClient from "../../lib/apiClient";

export const createOffering = (data) => {
  const { method, url } = routes.offerings.create();
  return apiClient({ method, url, data });
};

export const updateOffering = (id, data) => {
  const { method, url } = routes.offerings.update(id);
  return apiClient({ method, url, data });
};

export const removeOffering = (id) => {
  const { method, url } = routes.offerings.remove(id);
  return apiClient({ method, url });
};

export const filterOfferings = (opts = {}) => {
  const { method, url } = routes.offerings.filter(opts);
  return apiClient({ method, url });
};

export const eligibleForStudent = (id, studentId) => {
  const { method, url } = routes.offerings.eligibleForStudent(id, studentId);
  return apiClient({ method, url });
};

export const listMyOfferings = () => {
  const { method, url } = routes.offerings.my();
  return apiClient({ method, url });
};

export const findOffering = (id) => {
  const { method, url } = routes.offerings.find(id);
  return apiClient({ method, url });
};

export const listWithSeats = () => {
  const { method, url } = routes.offerings.listWithSeats();
  return apiClient({ method, url });
};

export const hasPassedCourse = (studentId, courseId) => {
  const { method, url } = routes.offerings.hasPassedCourse(studentId, courseId);
  return apiClient({ method, url });
};

export const allPrereqsMet = (studentId, courseId) => {
  const { method, url } = routes.offerings.allPrereqsMet(studentId, courseId);
  return apiClient({ method, url });
};

export const searchClassmates = (offeringId, q) => {
  const { method, url } = routes.offerings.searchClassmates(offeringId, q);
  return apiClient({ method, url });
};

export const listOfferingsForCourse = (courseId) => {
  const { method, url } = routes.offerings.listOfferingsForCourse(courseId);
  return apiClient({ method, url });
};

export const addOfferingPrereq = (offeringId, prereqOfferingId) => {
  const { method, url } = routes.offerings.addPrereq(offeringId);
  return apiClient({ method, url, data: { prereq_offering_id: prereqOfferingId } });
};

export const removeOfferingPrereq = (offeringId, prereqOfferingId) => {
  const { method, url } = routes.offerings.removePrereq(offeringId, prereqOfferingId);
  return apiClient({ method, url });
};

