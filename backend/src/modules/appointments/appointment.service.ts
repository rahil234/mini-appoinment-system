import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { HttpError } from '@/utils/http-error';
import { IAppointmentRepository } from './repositories/appointment.repository.interface';

@injectable()
export class AppointmentService {
  constructor(
    @inject(TYPES.AppointmentRepository)
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async create(data: {
    title: string;
    date: Date;
    description?: string;
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    userId: string;
  }) {
    return this.appointmentRepository.create(data);
  }

  async update(id: string, userId: string, data: Partial<any>) {
    const existing = await this.appointmentRepository.findByIdAndUser(
      id,
      userId,
    );

    if (!existing) {
      throw new HttpError('Appointment not found', 404);
    }

    return this.appointmentRepository.update(id, data);
  }

  async list(filters: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    userId?: string;
    date?: string;
  }) {
    const { data, total } = await this.appointmentRepository.findMany(filters);

    return {
      data,
      meta: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }
}
