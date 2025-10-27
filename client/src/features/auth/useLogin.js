import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  login as loginApi,
  registerStudent,
  registerTeacher,
  me as apiMe,
} from "./auth.api";
import { queryKeys } from "../../utils/queryKeys";

export function useLogin({ onSuccess } = {}) {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ email, password }) => loginApi(email, password),
    onSuccess: async () => {
      const me = await apiMe();
      qc.setQueryData(queryKeys.auth.me(), me);
      if (onSuccess) onSuccess(me);
    },
  });
  return {
    login: (email, password) => mutation.mutate({ email, password }),
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

export function useRegister({ onSuccess } = {}) {
  const qc = useQueryClient();

  const regStudent = useMutation({
    mutationFn: (payload) => registerStudent(payload),
  });

  const regTeacher = useMutation({
    mutationFn: (payload) => registerTeacher(payload),
  });

  const register = async (form) => {
    if (form.role === "teacher") {
      await regTeacher.mutateAsync({
        email: form.email,
        password: form.password,
        teacher_number: form.teacher_number,
      });
    } else {
      await regStudent.mutateAsync({
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
        student_number: form.student_number || undefined,
      });
    }
    await loginApi(form.email, form.password); // sets cookie
    const me = await apiMe();
    qc.setQueryData(queryKeys.auth.me(), me);
    if (onSuccess) onSuccess(me);
  };
  return {
    register,
    isPending: regStudent.isPending || regTeacher.isPending,
    error: regStudent.error || regTeacher.error,
  };
}
