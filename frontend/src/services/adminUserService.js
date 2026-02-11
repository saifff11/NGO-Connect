import api from "./apiService";

export const adminUserService = {
  getUsers: () => api.get("/users/admin/users/"),

  // ADD THIS
  toggleUser: (id) => api.patch(`/users/admin/users/${id}/toggle/`),
  getPending: () => api.get("/users/admin/pending/"),

  getPendingNGOs: () => api.get("/users/admin/pending-ngos/"),
  getPendingUsers: () => api.get("/users/admin/pending-users/"),
};
