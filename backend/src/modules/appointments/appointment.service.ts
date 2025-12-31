import { injectable } from 'inversify';

import { HttpError } from '@/utils/http-error';
import { prisma } from '@/config/prisma.config';

@injectable()
export class AppointmentService {
  async create(data: {
    title: string;
    date: Date;
    status?: any;
    userId: string;
  }) {
    return prisma.appointment.create({ data });
  }

  async update(id: string, data: Partial<any>) {
    const existing = await prisma.appointment.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existing) {
      throw new HttpError('Appointment not found', 404);
    }

    return prisma.appointment.update({
      where: { id },
      data,
    });
  }

  async list(filters: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    userId?: string;
    date?: string;
  }) {
    const { page, limit, status, userId, date } = filters;

    const where: any = { isDeleted: false };

    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (filters.search) where.title = { contains: filters.search };
    if (date)
      where.date = {
        gte: new Date(date),
        lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
      };

    const [data, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.appointment.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
