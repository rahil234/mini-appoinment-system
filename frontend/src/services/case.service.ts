import api from '@/lib/api';
import { AssignCaseDto, Case, CreateCaseDto } from '@/types';

export const caseService = {
  async getCases(): Promise<Case[]> {
    const response = await api.get<Case[]>('/cases');
    return response.data;
  },

  async createCase(data: CreateCaseDto): Promise<Case> {
    const response = await api.post<Case>('/cases', data);
    return response.data;
  },

  async assignCase(id: string, data: AssignCaseDto): Promise<Case> {
    const response = await api.put<Case>(`/cases/${id}/assign`, data);
    return response.data;
  },

  async deleteCase(id: string): Promise<void> {
    await api.delete(`/cases/${id}`);
  },
};
