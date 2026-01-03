import { injectable } from 'inversify';
import { Appointment } from '@prisma/client';

import { prisma } from '@/config/prisma.config';
import { IAppointmentRepository } from '@/modules/appointments/repositories/appointment.repository.interface';

@injectable()
export class PrismaAppointmentRepository implements IAppointmentRepository {
  async create(data: {
    title: string;
    date: Date;
    description?: string;
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    userId: string;
  }): Promise<Appointment> {
    return prisma.appointment.create({ data });
  }

  async findByIdAndUser(
    id: string,
    userId: string,
  ): Promise<Appointment | null> {
    return prisma.appointment.findFirst({
      where: { id, userId, isDeleted: false },
    });
  }

  async update(id: string, data: Partial<Appointment>): Promise<Appointment> {
    return prisma.appointment.update({
      where: { id },
      data,
    });
  }

  async findMany(filters: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    userId?: string;
    date?: string;
  }): Promise<{ data: Appointment[]; total: number }> {
    const { page, limit, status, userId, date, search } = filters;

    const where: any = { isDeleted: false };

    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (search) where.title = { contains: search };
    if (date) {
      const start = new Date(date);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      where.date = { gte: start, lt: end };
    }

    const [data, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.appointment.count({ where }),
    ]);

    return { data, total };
  }
}
