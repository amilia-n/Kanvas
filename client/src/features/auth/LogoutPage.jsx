import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../auth/auth.api";
import { queryKeys } from "../../utils/queryKeys";
import { paths } from "../../routes/paths";

export default function LogoutPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await logout();
      } catch (err) {
        void err;
      }
      if (!active) {
        return;
      }
      qc.removeQueries({ queryKey: queryKeys.auth.me(), exact: true });
      navigate(paths.login, { replace: true });
    })();

    return () => {
      active = false;
    };
  }, [qc, navigate]);

  return <div>Logging out...</div>;
}
