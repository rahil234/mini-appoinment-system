import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/auth.service.ts";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});


api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!error.response) {
      console.error("Network error");
      return Promise.reject(error);
    }

    if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        // Call refresh endpoint (cookies sent automatically)
        await authService.refreshToken();

        isRefreshing = false;
        onRefreshed();

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;

        // Refresh failed → logout
        const authStore = useAuthStore.getState();
        authStore.clearAuth();

        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register"
        ) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle 403
    if (error.response.status === 403) {
      console.error("Access denied");
    }

    return Promise.reject(error);
  }
);

export default api;
