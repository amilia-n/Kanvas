import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listAssignmentsForOffering,
  createAssignment,
  updateAssignment,
  openAssignment,
  closeAssignment,
  deleteAssignment,
  getAssignment,
} from "./assignments.api";
import { queryKeys } from "../../utils/queryKeys";

export function useAssignments(offeringId, { enabled = true } = {}) {
  return useQuery({
    queryKey: queryKeys.assignments.byOffering(offeringId),
    queryFn: () => listAssignmentsForOffering(offeringId),
    enabled: enabled && Number.isFinite(Number(offeringId)),
  });
}

export function invalidateAssignments(qc, offeringId) {
  return qc.invalidateQueries({
    queryKey: queryKeys.assignments.byOffering(offeringId),
  });
}

export function useCreateAssignment(offeringId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createAssignment({ ...data, offeringId }),
    onSuccess: () => invalidateAssignments(qc, offeringId),
  });
}

export function useUpdateAssignment(offeringId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateAssignment(id, data),
    onSuccess: () => invalidateAssignments(qc, offeringId),
  });
}

export function useOpenAssignment(offeringId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => openAssignment(id),
    onSuccess: () => invalidateAssignments(qc, offeringId),
  });
}

export function useCloseAssignment(offeringId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => closeAssignment(id),
    onSuccess: () => invalidateAssignments(qc, offeringId),
  });
}

export function useDeleteAssignment(offeringId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteAssignment(id),
    onSuccess: () => invalidateAssignments(qc, offeringId),
  });
}

export function useAssignment(assignmentId, options = {}) {
  return useQuery({
    queryKey: queryKeys.assignments.detail(assignmentId),
    queryFn: () => getAssignment(assignmentId),
    enabled: Number.isFinite(Number(assignmentId)),
    ...options,
  });
}