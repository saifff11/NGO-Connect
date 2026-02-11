import api from "./apiService";

export const authService = {
  // 🔐 AUTH
  login: (data) => api.post("/users/login/", data),
  register: (data) => api.post("/users/register/", data),

  // 👤 PROFILE
  getProfile: () => api.get("/users/profile/"),

  // ✅ BACKWARD-COMPATIBLE METHODS (IMPORTANT)
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  setAuthData: (access, user, refresh = null) => {
    localStorage.setItem("access", access);
    if (refresh) localStorage.setItem("refresh", refresh);
    localStorage.setItem("user", JSON.stringify(user));
  },

  // 🆕 INTERNAL HELPERS (optional but fine)
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  saveAuth: (access, refresh, user) => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("user", JSON.stringify(user));
  },

  // 🚪 LOGOUT
  logout: () => {
    localStorage.clear();
    window.location.href = "/login";
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("access");
  },
};
