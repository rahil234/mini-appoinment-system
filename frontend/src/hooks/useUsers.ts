import {useQuery, useMutation, useQueryClient, keepPreviousData} from '@tanstack/react-query';
import {userService} from '@/services/user.service';
import {UpdateUserDto} from '@/types';

export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (page: number, limit: number) =>
        [...userKeys.lists(), {page, limit}] as const,
    detail: (id: string) => [...userKeys.all, id] as const,
};

export const useUsers = (page: number, limit: number) => {
    return useQuery({
        queryKey: userKeys.list(page, limit),
        queryFn: () => userService.getUsers({page, limit}),
        placeholderData: keepPreviousData,
    });
};

export const useUser = (id: string) => {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => userService.getUserById(id),
        enabled: !!id,
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, data}: { id: string; data: UpdateUserDto }) =>
            userService.updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: userKeys.all});
        },
    });
};

export const useToggleUserStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, isDeleted}: { id: string; isDeleted: boolean }) =>
            userService.toggleUserStatus(id, isDeleted),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: userKeys.all});
        },
    });
};
