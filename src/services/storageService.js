import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SESSION: 'lf_session',
  LAST_REPORT_DRAFT: 'lf_last_report_draft',
  CACHED_REPORTS: 'lf_cached_reports',
  SAVED_ITEMS: 'lf_saved_items',
};

export const storageService = {
  keys: KEYS,
  async setJSON(key, value) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  async getJSON(key, fallback = null) {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  },
  async remove(key) {
    await AsyncStorage.removeItem(key);
  },
};
