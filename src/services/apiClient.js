import axios from 'axios';
import {
  API_BASE_URL,
  getActiveDevApiBaseUrl,
  getDevApiBaseUrlCandidates,
  setActiveDevApiBaseUrl,
} from '../config/env';
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
  if (__DEV__) {
    config.baseURL = getActiveDevApiBaseUrl();
  }
  return config;
});

const isNetworkFailure = (error) => !error.response;
const DEV_CANDIDATES = getDevApiBaseUrlCandidates();

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!__DEV__ || !isNetworkFailure(error)) {
      throw error;
    }

    const originalConfig = error.config;
    if (!originalConfig) {
      throw error;
    }

    const retryCount = Number(originalConfig.__devRetryCount || 0);
    if (retryCount >= DEV_CANDIDATES.length - 1) {
      throw error;
    }

    const currentBase = getActiveDevApiBaseUrl();
    const currentIndex = DEV_CANDIDATES.indexOf(currentBase);
    const nextIndex = currentIndex >= 0 ? currentIndex + 1 : retryCount + 1;
    const nextBase = DEV_CANDIDATES[nextIndex];

    if (!nextBase) {
      throw error;
    }

    setActiveDevApiBaseUrl(nextBase);
    originalConfig.__devRetryCount = retryCount + 1;
    originalConfig.baseURL = nextBase;
    return apiClient.request(originalConfig);
  }
);

export default apiClient;
