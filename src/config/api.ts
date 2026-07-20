import axios from 'axios';

// ============================================================
// 🔧 SINGLE TOGGLE — flip this to switch environments
//    true  → localhost:5000 (via Vite proxy)
//    false → Vercel production backend
// ============================================================
const USE_LOCAL = false;

const VERCEL_URL = 'https://safety-iq-backend.vercel.app';

export const BACKEND_URL = USE_LOCAL ? 'http://localhost:5000' : VERCEL_URL;
export const API_BASE_URL = USE_LOCAL ? '/api' : `${VERCEL_URL}/api`;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
