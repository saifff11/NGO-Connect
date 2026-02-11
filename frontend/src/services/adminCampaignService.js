import api from "./apiService";

export const adminCampaignService = {
  getAll: () => api.get("/campaigns/admin/all/"),
  action: (campaignId, action) =>
    api.post(`/campaigns/admin/action/${campaignId}/`, { action }),
};
