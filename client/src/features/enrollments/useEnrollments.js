import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  requestWaitlist,
  cancelWaitlist,
  approveEnrollment,
  denyEnrollment,
  dropEnrollment,
  completeEnrollment,
  listWaitlist,
  seatsLeft,
  listEnrolled,
} from "./enrollments.api";
import { queryKeys } from "../../utils/queryKeys";

export function useRequestWaitlist({ onSuccess } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (offeringId) => requestWaitlist(offeringId),
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: queryKeys.offerings.all() });
      qc.invalidateQueries({ queryKey: queryKeys.enrollments });
      if (onSuccess) onSuccess(...args);
    },
  });
}

export function useCancelWaitlist({ onSuccess } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (offeringId) => cancelWaitlist(offeringId),
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: queryKeys.offerings.all() });
      qc.invalidateQueries({ queryKey: queryKeys.enrollments });
      if (onSuccess) onSuccess(...args);
    },
  });
}

export function useApproveEnrollment({ onSuccess } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ offeringId, studentId }) => approveEnrollment(offeringId, studentId),
    onSuccess: (data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.enrollments.waitlist(vars.offeringId) });
      qc.invalidateQueries({ queryKey: queryKeys.enrollments.seatsLeft(vars.offeringId) });
      qc.invalidateQueries({ queryKey: queryKeys.offerings.all() });
      qc.invalidateQueries({ queryKey: queryKeys.offerings.detail(vars.offeringId) }); // ADD THIS
      if (onSuccess) onSuccess(data, vars);
    },
  });
}

export function useDenyEnrollment({ onSuccess } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ offeringId, studentId }) => denyEnrollment(offeringId, studentId),
    onSuccess: (data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.enrollments.waitlist(vars.offeringId) });
      if (onSuccess) onSuccess(data, vars);
    },
  });
}

export function useDropEnrollment({ onSuccess } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ offeringId, studentId }) => dropEnrollment(offeringId, studentId),
    onSuccess: (data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.enrollments.seatsLeft(vars.offeringId) });
      qc.invalidateQueries({ queryKey: queryKeys.offerings.all() });
      qc.invalidateQueries({ queryKey: queryKeys.offerings.detail(vars.offeringId) }); // ADD THIS
      if (onSuccess) onSuccess(data, vars);
    },
  });
}

export function useCompleteEnrollment({ onSuccess } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ offeringId, studentId }) => completeEnrollment(offeringId, studentId),
    onSuccess: (data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.offerings.all() });
      qc.invalidateQueries({ queryKey: queryKeys.offerings.detail(vars.offeringId) }); // ADD THIS
      if (onSuccess) onSuccess(data, vars);
    },
  });
}

export function useWaitlist(offeringId, options = {}) {
  return useQuery({
    queryKey: queryKeys.enrollments.waitlist(offeringId),
    queryFn: () => listWaitlist(offeringId),
    enabled: Number.isFinite(Number(offeringId)) && (options.enabled ?? true),
    ...options,
  });
}

export function useSeatsLeft(offeringId, options = {}) {
  return useQuery({
    queryKey: queryKeys.enrollments.seatsLeft(offeringId),
    queryFn: () => seatsLeft(offeringId),
    enabled: Number.isFinite(Number(offeringId)) && (options.enabled ?? true),
    ...options,
  });
}

export function useEnrolled(offeringId, options = {}) {
  return useQuery({
    queryKey: [...queryKeys.enrollments.waitlist(offeringId), "enrolled"],
    queryFn: () => listEnrolled(offeringId),
    enabled: Number.isFinite(Number(offeringId)) && (options.enabled ?? true),
    ...options,
  });
}

export { useUpdateOffering } from "../offerings/useOfferings";

export { useOfferingsWithSeats as useOfferings } from "../offerings/useOfferings";