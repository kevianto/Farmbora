import axios from 'axios';

// Connect to local backend for the demo
const BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to all requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('farmbora_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear invalid or expired JWT token
      localStorage.removeItem('farmbora_token');
    }
    return Promise.reject(error);
  }
);

export const endpoints = {
  auth: {
    login: '/auth/login',
    signup: '/auth/register',
    me: '/auth/me',
  },
  farm: {
    register: '/farm/register',
    get: '/farm/my-farm',
  },
  sensors: {
    live: '/sensor/live',
  },
  weather: {
    current: '/weather/current',
  },
  ai: {
    insights: '/ai/insights',
    alerts: '/ai/alerts',
    predictions: '/ai/predictions',
    chat: '/ai/chat',
  },
  // Update market to point to backend
  market: {
    list: '/market/products',
    create: '/market/products/create',
  },
  demo: {
    setScenario: '/demo/scenario',
  },
  chat: {
    send: '/chat/message',
  },
};
