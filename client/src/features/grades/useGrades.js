import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  getBreakdown as apiBreakdown,
  getCurrent as apiCurrent,
  getFinals as apiFinals,
  getGpaByCourse as apiGpaByCourse,
  getGpaCumulative as apiGpaCumulative,
  updateFinalGrade as apiUpdateFinalGrade
} from "./grades.api";
import { queryKeys } from "../../utils/queryKeys";

export function useGradeBreakdown(offeringId, options = {}) {
  return useQuery({
    queryKey: queryKeys.grades.breakdown(offeringId),
    queryFn: () => apiBreakdown(offeringId),
    enabled: Number.isFinite(Number(offeringId)) && (options.enabled ?? true),
    ...options,
  });
}

export function useCurrentGrade(offeringId, options = {}) {
  return useQuery({
    queryKey: queryKeys.grades.current(offeringId),
    queryFn: () => apiCurrent(offeringId),
    enabled: Number.isFinite(Number(offeringId)) && (options.enabled ?? true),
    ...options,
  });
}

export function useFinalGrades(options = {}) {
  return useQuery({
    queryKey: queryKeys.grades.finals(),
    queryFn: () => apiFinals(),
    ...options,
  });
}

export function useGpaByCourse(options = {}) {
  return useQuery({
    queryKey: queryKeys.grades.gpaByCourse(),
    queryFn: () => apiGpaByCourse(),
    ...options,
  });
}

export function useGpaCumulative(options = {}) {
  return useQuery({
    queryKey: queryKeys.grades.gpaCumulative(),
    queryFn: () => apiGpaCumulative(),
    select: (data) => {
      if (data && typeof data === "object" && "gpa" in data) return data.gpa;
      return data ?? null;
    },
    ...options,
  });
}

export function useUpdateFinalGrade({ onSuccess } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiUpdateFinalGrade,
    onSuccess: (data, vars) => {
      qc.invalidateQueries({ 
        queryKey: ['submissions', 'root', 'offering', vars.offering_id] 
      });
      if (onSuccess) onSuccess(data, vars);
    },
  });
}