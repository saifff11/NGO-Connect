import api from "./apiService";

export const campaignService = {
  // ================= NGO =================
  getMyCampaigns: () => api.get("/campaigns/my/"),
  create: (data) => api.post("/campaigns/", data),

  // ================= DONOR (PUBLIC) =================
  getPublicCampaigns: () => api.get("/campaigns/public/"),

  // 🔥 REQUIRED FOR DONATE PAGE
  getPublicById: (id) => api.get(`/campaigns/public/${id}/`),
};
