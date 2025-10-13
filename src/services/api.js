import axios from 'axios';

const BASE_URL = 'https://api.farmbora.com';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const endpoints = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
  },
  profile: {
    get: '/profile',
    update: '/profile/update',
  },
  sensors: {
    current: '/sensors/current',
  },
  predictions: {
    get: '/predictions',
  },
  market: {
    list: '/market/products',
    create: '/market/products/create',
  },
  alerts: {
    list: '/alerts',
  },
  chat: {
    send: '/chat/message',
  },
};
