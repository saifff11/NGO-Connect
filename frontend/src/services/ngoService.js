import api from "./apiService";

export const ngoService = {
  getAll: () => api.get("/ngos/"),

  getApplications: () => api.get("/volunteers/ngo/applications/"),  // FIXED

  updateStatus: (id, action) =>
    api.patch(`/volunteers/update/${id}/`, { action }),  // FIXED

  assignTask: (data) =>
    api.post("/volunteers/ngo/assign-task/", data),
};
