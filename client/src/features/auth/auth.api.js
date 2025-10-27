import { routes } from "../../constants/apiRoutes";
import apiClient from "../../lib/apiClient";

export const registerStudent = (data) => {
  const { method, url } = routes.auth.registerStudent();
  return apiClient({ method, url, data });
};

export const registerTeacher = (data) => {
  const { method, url } = routes.auth.registerTeacher();
  return apiClient({ method, url, data });
};

export const login = (email, password) => {
  const { method, url } = routes.auth.login();
  return apiClient({ method, url, data: { email, password } });
};

export const me = () => {
  const { method, url } = routes.auth.me();
  return apiClient({ method, url });
};

export const logout = () => {
  const { method, url } = routes.auth.logout();
  return apiClient({ method, url });
};

export const resetBegin = (email) => {
  const { method, url } = routes.auth.resetBegin();
  return apiClient({ method, url, data: { email } });
};

export const resetCheck = (token) => {
  const { method, url } = routes.auth.resetCheck();
  return apiClient({ method, url, data: { token } });
};

export const resetFinish = ({ token, new_password }) => {
  const { method, url } = routes.auth.resetFinish();
  return apiClient({ method, url, data: { token, new_password } });
};
