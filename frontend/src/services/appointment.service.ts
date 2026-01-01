import api from "@/lib/api";
import {
  Appointment,
  AppointmentFilters,
  CreateAppointmentDto,
  PaginatedResponse,
  UpdateAppointmentDto
} from "@/types";

export const appointmentService = {
  async getAppointments(
    filters: AppointmentFilters = {}
  ): Promise<PaginatedResponse<Appointment>> {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.status) params.append("status", filters.status);
    if (filters.userId) params.append("userId", filters.userId);
    if (filters.date) params.append("date", filters.date);
    if (filters.search) params.append("search", filters.search);

    const response = await api.get<PaginatedResponse<Appointment>>(
      `/appointments?${params.toString()}`
    );
    return response.data;
  },

  async getUserAppointments(
    filters: AppointmentFilters = {}
  ): Promise<PaginatedResponse<Appointment>> {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.status) params.append("status", filters.status);
    if (filters.userId) params.append("userId", filters.userId);
    if (filters.date) params.append("date", filters.date);
    if (filters.search) params.append("search", filters.search);

    const response = await api.get<PaginatedResponse<Appointment>>(
      `/appointments/me?${params.toString()}`
    );
    return response.data;
  },

  async createAppointment(data: CreateAppointmentDto): Promise<Appointment> {
    const response = await api.post<Appointment>("/appointments", data);
    return response.data;
  },

  async updateAppointment(
    id: string,
    data: UpdateAppointmentDto
  ): Promise<Appointment> {
    const response = await api.put<Appointment>(`/appointments/${id}`, data);
    return response.data;
  },

  async deleteAppointment(id: string): Promise<void> {
    await api.delete(`/appointments/${id}`);
  }
};
