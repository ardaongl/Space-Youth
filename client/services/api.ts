import { store } from '@/store';
import axios, {AxiosHeaders, InternalAxiosRequestConfig} from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL || '';

export const api = axios.create({
  baseURL: baseUrl,
  timeout: 15000,
});

declare module 'axios' {
  export interface AxiosRequestConfig {
    requiresAuth?: boolean;
  }
}

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig & {requiresAuth?: boolean}) => {
    const headers = (config.headers ?? new AxiosHeaders()) as AxiosHeaders;

    if (config.requiresAuth) {
      const token = store.getState().user.token;
      console.log(token);
      
      if (!token) {
        return Promise.reject(new Error('Geçersiz token'));
      }
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (!headers.has('Accept')) headers.set('Accept', 'application/json');
    
    // Don't set Content-Type for FormData, axios will set it automatically with boundary
    // Also remove Content-Type if it exists for FormData to let axios handle it
    if (config.data instanceof FormData) {
      headers.delete('Content-Type');
    } else if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    config.headers = headers;
    return config;
  },
  error => Promise.reject(error),
);
