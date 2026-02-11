import api from './apiService';

export const userService = {
  getAll: () => api.get('/users/'),
  getProfile: () => api.get('/users/profile/'),
};
