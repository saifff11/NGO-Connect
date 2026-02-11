import api from "./apiService";

export const volunteerService = {
  getDashboard: () => api.get("/volunteers/dashboard/"),

  getPublicCampaigns: () => api.get("/campaigns/public/"),

  getAll: () => api.get("/campaigns/public/"),

  getNGOs: () => api.get("/volunteers/ngos/"),

  getTasks: () => api.get("/volunteers/tasks/"), // FIXED

  applyToCampaign: (campaignId) =>
    api.post("/volunteers/apply/", { campaign: campaignId }),

  completeTask: (id) => api.patch(`/volunteers/task/${id}/complete/`),
  completeTask: (id) => api.patch(`/volunteers/task/complete/${id}/`),
  getLeaderboard: () => api.get("/volunteers/leaderboard/"),
  downloadCertificate: (taskId) =>
    api.get(`/volunteers/certificate/${taskId}/`, { responseType: "blob" }),
};
