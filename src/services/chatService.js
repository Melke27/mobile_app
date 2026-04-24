import apiClient from './apiClient';

export const chatService = {
  async getConversation(itemId, otherUserId) {
    const { data } = await apiClient.get(`/chat/${itemId}/${otherUserId}`);
    return data;
  },

  async sendMessage(payload) {
    const { data } = await apiClient.post('/chat/send', payload);
    return data;
  },
};
