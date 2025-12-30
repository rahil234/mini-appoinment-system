import { injectable } from 'inversify';

import { HttpError } from '@/utils/http-error';
import { prisma } from '@/config/prisma.config';

@injectable()
export class CaseService {
  async create(data: { title: string; description?: string }) {
    return prisma.case.create({ data });
  }

  async assign(caseId: string, userId: string) {
    const existing = await prisma.case.findFirst({
      where: { id: caseId, isDeleted: false },
    });

    if (!existing) {
      throw new HttpError('Case not found', 404);
    }

    return prisma.case.update({
      where: { id: caseId },
      data: {
        assignedUserId: userId,
        status: 'ASSIGNED',
      },
    });
  }

  async list() {
    return prisma.case.findMany({
      where: { isDeleted: false },
      include: { assignedUser: true },
    });
  }
}
