import { routes } from "../../constants/apiRoutes";
import apiClient from "../../lib/apiClient";

const toCreatePayload = (data = {}) => ({
  role: data.role,
  email: data.email,
  password: data.password, 
  first_name: data.first_name ?? data.firstName,
  last_name: data.last_name ?? data.lastName,
  student_number: data.student_number ?? data.studentNumber,
  teacher_number: data.teacher_number ?? data.teacherNumber,
});

const toUpdatePayload = (data = {}) => ({
  email: data.email,
  first_name: data.first_name ?? data.firstName,
  last_name: data.last_name ?? data.lastName,
  student_number: data.student_number ?? data.studentNumber,
  teacher_number: data.teacher_number ?? data.teacherNumber,
});

export const listUsers = (opts = {}) => {
  const { method, url } = routes.users.list();
  const params = {};
  if (opts.limit != null) params.limit = opts.limit;
  if (opts.offset != null) params.offset = opts.offset;
  return apiClient({ method, url, params });
};

export const searchUsers = (q) => {
  const { method, url } = routes.users.search(q); 
  return apiClient({ method, url });
};

export const createUser = (data) => {
  const { method, url } = routes.users.create();
  return apiClient({ method, url, data: toCreatePayload(data) });
};

export const getUser = (id) => {
  const { method, url } = routes.users.get(id);
  return apiClient({ method, url });
};

export const updateUser = (id, data) => {
  const { method, url } = routes.users.update(id);
  return apiClient({ method, url, data: toUpdatePayload(data) });
};

export const removeUser = (id) => {
  const { method, url } = routes.users.remove(id);
  return apiClient({ method, url });
};

export const listMajors = (id) => {
  const { method, url } = routes.users.listMajors(id);
  return apiClient({ method, url });
};

export const addMajor = (id, codeOrData) => {
  const { method, url } = routes.users.addMajor(id);
  const code = typeof codeOrData === "string" ? codeOrData : codeOrData?.code;
  return apiClient({ method, url, data: { code } });
};

export const removeMajor = (id, code) => {
  const { method, url } = routes.users.removeMajor(id, code);
  return apiClient({ method, url });
};

export const addMajorsBulk = (id, codes) => {
  const { method, url } = routes.users.addMajorsBulk(id);
  const list = Array.isArray(codes) ? codes : [];
  return apiClient({ method, url, data: { codes: list } });
};

export const replaceMajors = (id, codes) => {
  const { method, url } = routes.users.replaceMajors(id);
  const list = Array.isArray(codes) ? codes : [];
  return apiClient({ method, url, data: { codes: list } });
};

export const getCurrentTerm = () => {
  const { method, url } = routes.users.getCurrentTerm();
  return apiClient({ method, url });
};

export const getNextTerm = () => {
  const { method, url } = routes.users.getNextTerm();
  return apiClient({ method, url });
};