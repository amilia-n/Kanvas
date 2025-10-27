import { useQuery } from "@tanstack/react-query";
import {
  listCourses,
  getCourse,
  getCourseIdByCode,
  listCoursesWithOfferings,
} from "./courses.api";
import { queryKeys } from "../../utils/queryKeys";

export function useCourses() {
  return useQuery({
    queryKey: queryKeys.courses.all(),
    queryFn: listCourses,
  });
}

export function useCoursesWithOfferings(options = {}) {
  return useQuery({
    queryKey: [...queryKeys.courses.all(), "with-offerings"],
    queryFn: listCoursesWithOfferings,
    ...options,
  });
}

export function useCourse(id, { enabled = true } = {}) {
  return useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => getCourse(id),
    enabled: enabled && !!id,
  });
}

export function useCourseIdByCode(code, { enabled = true } = {}) {
  return useQuery({
    queryKey: queryKeys.courses.byCode(code),
    queryFn: () => getCourseIdByCode(code),
    enabled: enabled && !!code,
  });
}

