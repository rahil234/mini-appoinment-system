import api from '@/lib/api';
import {User, UpdateUserDto} from '@/types';

export const userService = {
    async getUsers({page, limit}: { page: number; limit: number }): Promise<{
        data: User[];
        meta: { total: number; page: number; limit: number, totalPages: number };
    }> {
        const response = await api.get<{ data: User[] }>('/users', {
            params: {page, limit}
        });
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
        const response = await api.put<User>(`/users/${id}`, {isDeleted});
        return response.data;
    },
};
