// Central Axios client. Every request automatically carries the JWT.
import axios from 'axios';

export const TOKEN_KEY = 'clf_token';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const FILE_URL = API_URL.replace(/\/api\/?$/, ''); // where /uploads/... is served from

const api = axios.create({ baseURL: API_URL, timeout: 15000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// An expired/invalid token anywhere logs the user out (see main.jsx listener).
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event('clf:unauthorized'));
    }
    return Promise.reject(err);
  },
);
export default api;
