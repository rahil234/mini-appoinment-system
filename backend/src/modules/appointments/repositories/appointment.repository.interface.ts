import { Appointment } from '@prisma/client';

export interface IAppointmentRepository {
  create(data: {
    title: string;
    date: Date;
    description?: string;
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    userId: string;
  }): Promise<Appointment>;

  findByIdAndUser(id: string, userId: string): Promise<Appointment | null>;

  update(id: string, data: Partial<Appointment>): Promise<Appointment>;

  findMany(filters: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    userId?: string;
    date?: string;
  }): Promise<{
    data: Appointment[];
    total: number;
  }>;
}
