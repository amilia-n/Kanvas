import { useMutation } from "@tanstack/react-query";
import { resetFinish } from "./auth.api";

/**
 * Use to finalize a password reset with a token.
 * Expects: { token, newPassword }
 */
export function useResetPassword({ onSuccess } = {}) {
  return useMutation({
    mutationFn: ({ token, newPassword }) =>
      resetFinish({ token, new_password: newPassword }),
    onSuccess,
  });
}

export default useResetPassword;
