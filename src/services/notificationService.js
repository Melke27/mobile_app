import apiClient from './apiClient';

export const notificationService = {
  async initialize() {
    // Integrate FCM permissions and token retrieval in production.
    return true;
  },

  async registerDeviceToken(token, platform = 'android') {
    const { data } = await apiClient.post('/notifications/token', { token, platform });
    return data;
  },

  async getMyNotifications(params = {}) {
    const { data } = await apiClient.get('/notifications/mine', { params });
    return data;
  },

  async markRead(id) {
    const { data } = await apiClient.patch(`/notifications/${id}/read`);
    return data;
  },

  async markAllRead() {
    const { data } = await apiClient.patch('/notifications/read-all');
    return data;
  },
};
