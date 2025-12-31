import { injectable } from 'inversify';
import { prisma } from '@/config/prisma.config';

@injectable()
export class AnalyticsService {

  async getDashboardStats(userId: string, role: string) {
    const appointmentWhere =
      role === 'ADMIN' ? { isDeleted: false } : { isDeleted: false, userId };

    const [total, pending, confirmed, cancelled, recentAppointments] =
      await Promise.all([
        prisma.appointment.count({ where: appointmentWhere }),
        prisma.appointment.count({
          where: { ...appointmentWhere, status: 'PENDING' },
        }),
        prisma.appointment.count({
          where: { ...appointmentWhere, status: 'CONFIRMED' },
        }),
        prisma.appointment.count({
          where: { ...appointmentWhere, status: 'CANCELLED' },
        }),
        prisma.appointment.findMany({
          where: appointmentWhere,
          orderBy: { date: 'asc' },
          take: 5,
          select: {
            id: true,
            title: true,
            date: true,
            status: true,
          },
        }),
      ]);

    const response: any = {
      appointments: {
        total,
        pending,
        confirmed,
        cancelled,
      },
      recentAppointments,
    };

    if (role === 'ADMIN') {
      const [totalCases, unassignedCases] = await Promise.all([
        prisma.case.count({ where: { isDeleted: false } }),
        prisma.case.count({
          where: { isDeleted: false, assignedUserId: null },
        }),
      ]);

      response.cases = {
        total: totalCases,
        unassigned: unassignedCases,
      };
    }

    return response;
  }
}
