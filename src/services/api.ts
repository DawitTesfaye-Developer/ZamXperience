// src/services/api.ts
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

// Replace with your computer's local IP for physical device testing
// e.g., 'http://192.168.1.100:3000'
const BASE_URL = 'http://localhost:3000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach the token from EncryptedStorage
api.interceptors.request.use(
  async (config) => {
    const token = await EncryptedStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;