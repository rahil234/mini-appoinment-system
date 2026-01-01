import api from '@/lib/api';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    return api.post('/auth/logout');
  },

  async refreshToken(): Promise<void> {
    return api.post('/auth/refresh-token');
  }
};
