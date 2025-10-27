import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addMaterial,
  removeMaterial,
  listMaterialsForOffering,
} from "./materials.api";
import { queryKeys } from "../../utils/queryKeys";

export function useMaterials(offeringId, options = {}) {
  return useQuery({
    queryKey: queryKeys.materials.byOffering(offeringId),
    queryFn: () => listMaterialsForOffering(offeringId),
    enabled: Number.isFinite(Number(offeringId)) && (options.enabled ?? true),
    ...options,
  });
}

export function useAddMaterial(offeringId, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => addMaterial({ ...data, offeringId }),
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: queryKeys.materials.byOffering(offeringId) });
      options.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useRemoveMaterial(offeringId, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => removeMaterial(id),
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: queryKeys.materials.byOffering(offeringId) });
      options.onSuccess?.(...args);
    },
    ...options,
  });
}


