import api from '@/lib/api';
import { User, UpdateUserDto } from '@/types';

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  async toggleUserStatus(id: string, isDeleted: boolean): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, { isDeleted });
    return response.data;
  },
};
