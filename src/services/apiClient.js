import axios from 'axios';
import { API_BASE_URL } from '../config/env';
import { storageService } from './storageService';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use(async (config) => {
  const session = await storageService.getJSON(storageService.keys.SESSION, null);
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

export default apiClient;
