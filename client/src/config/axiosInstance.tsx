import axios from 'axios';
import { removeUser } from '../features/auth/state/auth/authSlice';
import { store } from '../app/store';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:6969/',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config;

    // 1. Guard against network/undefined errors
    if (!error.response) {
      return Promise.reject(error);
    }

    // 2. Stop loop: If the refresh request itself fails with 401, redirect immediately
    if (error.response.status === 401 && originalReq.url === '/auth/users/refresh') {
      store.dispatch(removeUser());
      return Promise.reject(error);
    }

    // 3. Handle 401 for other requests
    if (error.response.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      try {
        await axiosInstance.get('/auth/users/refresh');
        return axiosInstance(originalReq); // Retry the original request
      } catch (refreshError) {
        store.dispatch(removeUser());
        return Promise.reject(refreshError);
      }
    }

    // 4. Critical: Always reject all other non-401 errors
    return Promise.reject(error);
  }
);
