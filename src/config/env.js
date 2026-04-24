const EMULATOR_API_BASE_URL = 'http://10.0.2.2:5000/api';
const LOCAL_PHONE_API_BASE_URL = 'http://192.168.1.20:5000/api';
const HOSTED_API_BASE_URL = 'https://your-backend.onrender.com/api';

// Set to true only when testing on a physical phone against your laptop backend.
const USE_LOCAL_PHONE_BACKEND = false;

export const API_BASE_URL = __DEV__
  ? (USE_LOCAL_PHONE_BACKEND ? LOCAL_PHONE_API_BASE_URL : EMULATOR_API_BASE_URL)
  : HOSTED_API_BASE_URL;
export const DEFAULT_CAMPUS = 'Adama Campus';
