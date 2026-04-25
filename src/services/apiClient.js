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
  // Render free services can take extra time on first request after idle.
  timeout: 60000,
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
const MAX_NETWORK_RETRIES = 2;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!isNetworkFailure(error)) {
      throw error;
    }

    const originalConfig = error.config;
    if (!originalConfig) {
      throw error;
    }

    if (__DEV__) {
      const retryCount = Number(originalConfig.__devRetryCount || 0);
      if (retryCount < DEV_CANDIDATES.length - 1) {
        const currentBase = getActiveDevApiBaseUrl();
        const currentIndex = DEV_CANDIDATES.indexOf(currentBase);
        const nextIndex = currentIndex >= 0 ? currentIndex + 1 : retryCount + 1;
        const nextBase = DEV_CANDIDATES[nextIndex];

        if (nextBase) {
          setActiveDevApiBaseUrl(nextBase);
          originalConfig.__devRetryCount = retryCount + 1;
          originalConfig.baseURL = nextBase;
          return apiClient.request(originalConfig);
        }
      }
    }

    const networkRetryCount = Number(originalConfig.__networkRetryCount || 0);
    if (networkRetryCount >= MAX_NETWORK_RETRIES) {
      throw error;
    }

    originalConfig.__networkRetryCount = networkRetryCount + 1;
    await wait(1500 * (networkRetryCount + 1));
    return apiClient.request(originalConfig);
  }
);

export default apiClient;
