import { routes } from "../../constants/apiRoutes";
import apiClient from "../../lib/apiClient";

export const addMaterial = (data) => {
  const { method, url } = routes.materials.add();
  const payload = {
    ...data,
    ...(data.offeringId !== undefined ? { offering_id: data.offeringId } : {}),
  };
  delete payload.offeringId;
  return apiClient({ method, url, data: payload });
};

export const removeMaterial = (id) => {
  const { method, url } = routes.materials.remove(id);
  return apiClient({ method, url });
};

export const listMaterialsForOffering = (offeringId) => {
  const { method, url } = routes.materials.listForOffering(offeringId);
  return apiClient({ method, url });
};
