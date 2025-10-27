import { routes } from "../../constants/apiRoutes";
import apiClient from "../../lib/apiClient";

export const listAssignmentsForOffering = (offeringId) => {
  const { method, url } = routes.assignments.listForOffering(offeringId);
  return apiClient({ method, url });
};

export const createAssignment = (data) => {
  const { method, url } = routes.assignments.create();
  const payload = {
    ...data,
    ...(data.offeringId !== undefined ? { offering_id: data.offeringId } : {}),
  };
  delete payload.offeringId;
  return apiClient({ method, url, data: payload });
};

export const updateAssignment = (id, data) => {
  const { method, url } = routes.assignments.update(id);
  return apiClient({ method, url, data });
};

export const openAssignment = (id) => {
  const { method, url } = routes.assignments.open(id);
  return apiClient({ method, url });
};

export const closeAssignment = (id) => {
  const { method, url } = routes.assignments.close(id);
  return apiClient({ method, url });
};

export const deleteAssignment = (id) => {
  const { method, url } = routes.assignments.remove(id);
  return apiClient({ method, url });
};

export const getAssignment = (id) => {
  const { method, url } = routes.assignments.get(id);
  return apiClient({ method, url });
};
