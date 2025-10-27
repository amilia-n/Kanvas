import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { me as apiMe } from "../auth/auth.api";
import {
  updateUser,
  listMajors,
  addMajor,
  removeMajor,
  replaceMajors,
  searchUsers,
  getCurrentTerm,
  getNextTerm,
} from "./users.api";
import { queryKeys } from "../../utils/queryKeys";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: apiMe,
  });
}

export function useUpdateMe(userId) {
  const qc = useQueryClient();
  const id = Number(userId);

  return useMutation({
    mutationFn: (data) => updateUser(id, data),
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.auth.me(), data);
      qc.invalidateQueries({ queryKey: queryKeys.users?.detail?.(id) ?? ["users", id] });
    },
  });
}

export function useUserMajors(userId) {
  const id = Number(userId);
  return useQuery({
    queryKey: queryKeys.users.majors(id),
    queryFn: () => listMajors(id),
    enabled: Number.isFinite(id),
  });
}

export function useAddMajor(userId) {
  const qc = useQueryClient();
  const id = Number(userId);

  return useMutation({
    mutationFn: (code) => addMajor(id, {code}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.majors(id) });
      qc.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}

export function useRemoveMajor(userId) {
  const qc = useQueryClient();
  const id = Number(userId);

  return useMutation({
    mutationFn: (code) => removeMajor(id, code),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.majors(id) });
      qc.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}

export function useReplaceMajors(userId) {
  const qc = useQueryClient();
  const id = Number(userId);

  return useMutation({
    mutationFn: (codes = []) => replaceMajors(id, {codes}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.majors(id) });
      qc.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}

export function useSearchUsers(q, options = {}) {
  return useQuery({
    queryKey: queryKeys.users.search(q),
    queryFn: () => searchUsers(q),
    enabled: options.enabled ?? true,
    ...options,
  });
}

export function useCurrentTerm(options = {}) {
  return useQuery({
    queryKey: ["terms", "current"],
    queryFn: getCurrentTerm,
    ...options,
  });
}

export function useNextTerm(options = {}) {
  return useQuery({
    queryKey: ["terms", "next"],
    queryFn: getNextTerm,
    ...options,
  });
}