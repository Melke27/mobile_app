import apiClient from './apiClient';

export const authService = {
  async register(payload) {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  },

  async login(email, password) {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },

  async me() {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
};
