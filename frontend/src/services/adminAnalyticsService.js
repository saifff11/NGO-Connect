import api from "./apiService";

export const adminAnalyticsService = {
  getAnalytics: () => api.get("/admin/analytics/"),
};
