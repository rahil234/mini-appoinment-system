import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  AppointmentFilters,
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from "@/types";
import { userService } from "@/services/user.service";
import { appointmentService } from "@/services/appointment.service.ts";

export const appointmentKeys = {
  all: ["appointments"] as const,
  lists: () => [...appointmentKeys.all, "list"] as const,
  list: (filters: AppointmentFilters) => [...appointmentKeys.lists(), filters] as const
};

export const userKeys = {
  all: ["users"] as const,
  list: () => [...userKeys.all, "list"] as const
};

export function useAppointments(filters: AppointmentFilters, isAdmin = false) {
  return useQuery({
    queryKey: appointmentKeys.list(filters),
    queryFn: () => isAdmin ? appointmentService.getAppointments(filters) : appointmentService.getUserAppointments(filters),
    staleTime: 30000
  });
}

export function useUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => userService.getUsers(),
    staleTime: 60000
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentDto) =>
      appointmentService.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    }
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentDto }) =>
      appointmentService.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    }
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentService.deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    }
  });
}
