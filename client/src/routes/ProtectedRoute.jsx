import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMe } from "@/features/users/useMe";
import { paths } from "./paths";

function hasAllowedRole(user, roles) {
  if (!roles || roles.length === 0) return true;
  return roles.includes(user?.role);
}

export default function ProtectedRoute({
  roles,
  redirectTo = paths.login,
  forbiddenTo = paths.forbidden,
  children,
}) {
  const location = useLocation();

  const { data: user, isLoading, isError } = useMe();
  if (isLoading) return null;
  if (isError || !user) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (!hasAllowedRole(user, roles)) {
    return <Navigate to={forbiddenTo} replace />;
  }

  return children ?? <Outlet />;
}
