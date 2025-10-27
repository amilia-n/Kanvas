import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  submitOrResubmit, 
  submitGrade, 
  listSubmissionsForOffering,
  listAllSubmissionsForTeacher,
  getMySubmissions 
} from "./submissions.api";
import { queryKeys } from "../../utils/queryKeys";

export function useSubmitOrResubmit({ onSuccess } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitOrResubmit,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: queryKeys.grades.breakdown() });
      qc.invalidateQueries({ queryKey: queryKeys.submissions.root() });
      if (onSuccess) onSuccess(...args);
    },
  });
}

export function useSubmitGrade({ onSuccess } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitGrade,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: queryKeys.submissions.root() });
      qc.invalidateQueries({ queryKey: queryKeys.grades });
      if (onSuccess) onSuccess(...args);
    },
  });
}

export function useSubmissionsForOffering(offeringId, options = {}) {
  return useQuery({
    queryKey: [...queryKeys.submissions.root(), "offering", offeringId],
    queryFn: () => listSubmissionsForOffering(offeringId),
    enabled: Number.isFinite(Number(offeringId)) && (options.enabled ?? true),
    ...options,
  });
}

export function useMySubmissions(offeringId, options = {}) {
  return useQuery({
    queryKey: [...queryKeys.submissions.root(), "my", offeringId],
    queryFn: () => getMySubmissions(offeringId),
    enabled: Number.isFinite(Number(offeringId)) && (options.enabled ?? true),
    ...options,
  });
}

export function useAllSubmissionsForTeacher(options = {}) {
  return useQuery({
    queryKey: [...queryKeys.submissions.root(), "teacher", "all"],
    queryFn: listAllSubmissionsForTeacher,
    ...options,
  });
}