import api from "./apiService";

export const donationService = {
  // 💰 Donor → donate to a campaign
  donate: (data) => api.post("/donations/donate/", data),

  // 🙋 Donor → view own donations
  getMyDonations: () => api.get("/donations/my/"),

  // 🏢 NGO → view donations received on campaigns
  getNGODonations: () => api.get("/donations/ngo/"),
};
