import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOffering,
  updateOffering,
  removeOffering,
  filterOfferings,
  eligibleForStudent,
  findOffering,
  listWithSeats,
  hasPassedCourse,
  allPrereqsMet,
  listMyOfferings,
  searchClassmates,
  listOfferingsForCourse,
  addOfferingPrereq,
  removeOfferingPrereq,
} from "./offerings.api";
import { queryKeys } from "../../utils/queryKeys";

export function useOfferingsWithSeats(options = {}) {
  return useQuery({
    queryKey: queryKeys.offerings.withSeats(),
    queryFn: () => listWithSeats(),
    ...options,
  });
}

export function useFilterOfferings(opts = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.offerings.filter(opts),
    queryFn: () => filterOfferings(opts),
    ...options,
  });
}

export function useOffering(id, options = {}) {
  return useQuery({
    queryKey: queryKeys.offerings.detail(id),
    queryFn: () => findOffering(id),
    enabled: Number.isFinite(Number(id)) && (options.enabled ?? true),
    ...options,
  });
}

export function useEligibleForStudent(offeringId, studentId, options = {}) {
  return useQuery({
    queryKey: queryKeys.offerings.eligible(offeringId, studentId),
    queryFn: () => eligibleForStudent(offeringId, studentId),
    enabled:
      Number.isFinite(Number(offeringId)) &&
      Number.isFinite(Number(studentId)) &&
      (options.enabled ?? true),
    ...options,
  });
}

export function useHasPassedCourse(studentId, courseId, options = {}) {
  return useQuery({
    queryKey: queryKeys.offerings.hasPassed(studentId, courseId),
    queryFn: () => hasPassedCourse(studentId, courseId),
    enabled:
      Number.isFinite(Number(studentId)) &&
      Number.isFinite(Number(courseId)) &&
      (options.enabled ?? true),
    ...options,
  });
}

export function useAllPrereqsMet(studentId, courseId, options = {}) {
  return useQuery({
    queryKey: queryKeys.offerings.prereqsMet(studentId, courseId),
    queryFn: () => allPrereqsMet(studentId, courseId),
    enabled:
      Number.isFinite(Number(studentId)) &&
      Number.isFinite(Number(courseId)) &&
      (options.enabled ?? true),
    ...options,
  });
}

export function useCreateOffering(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createOffering(data),
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: queryKeys.offerings.withSeats() });
      qc.invalidateQueries({ queryKey: queryKeys.offerings.all() });
      qc.invalidateQueries({ queryKey: queryKeys.courses.all() });
      options.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useUpdateOffering(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateOffering(id, data),
    onSuccess: (_data, vars, ...rest) => {
      qc.invalidateQueries({ queryKey: queryKeys.offerings.detail(vars.id) });
      qc.invalidateQueries({ queryKey: queryKeys.offerings.withSeats() });
      qc.invalidateQueries({ queryKey: [...queryKeys.offerings.all(), "my"] }); // ADD THIS LINE
      options.onSuccess?.(_data, vars, ...rest);
    },
    ...options,
  });
}

export function useRemoveOffering(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => removeOffering(id),
    onSuccess: (_data, id, ...rest) => {
      qc.invalidateQueries({ queryKey: queryKeys.offerings.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.offerings.withSeats() });
      options.onSuccess?.(_data, id, ...rest);
    },
    ...options,
  });
}

export function useMyOfferings(options = {}) {
  return useQuery({
    queryKey: [...queryKeys.offerings.all(), "my"],
    queryFn: () => listMyOfferings(),
    ...options,
  });
}

export function useSearchClassmates(offeringId, q, { enabled = false } = {}) {
  return useQuery({
    queryKey: queryKeys.offerings.classmatesSearch(offeringId, q),
    queryFn: () => searchClassmates(offeringId, q),
    enabled,
  });
}

export function useOfferingsForCourse(courseId, options = {}) {
  return useQuery({
    queryKey: queryKeys.offerings.byCourse(courseId),
    queryFn: () => listOfferingsForCourse(courseId),
    ...options,
  });
}

export function useAddOfferingPrereq(offeringId, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (prereqOfferingId) =>
      addOfferingPrereq(offeringId, prereqOfferingId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: queryKeys.offerings.detail(offeringId),
      });
      options.onSuccess?.();
    },
    ...options,
  });
}

export function useRemoveOfferingPrereq(offeringId, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (prereqOfferingId) =>
      removeOfferingPrereq(offeringId, prereqOfferingId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: queryKeys.offerings.detail(offeringId),
      });
      options.onSuccess?.();
    },
    ...options,
  });
}
