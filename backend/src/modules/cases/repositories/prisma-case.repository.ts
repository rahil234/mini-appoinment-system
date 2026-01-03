import { injectable } from 'inversify';
import { Case, User } from '@prisma/client';

import { prisma } from '@/config/prisma.config';
import { ICaseRepository } from './case.repository.interface';

@injectable()
export class PrismaCaseRepository implements ICaseRepository {
  async create(data: { title: string; description?: string }): Promise<Case> {
    return prisma.case.create({ data });
  }

  async findById(id: string): Promise<Case | null> {
    return prisma.case.findFirst({
      where: { id, isDeleted: false },
    });
  }

  async assign(caseId: string, userId: string): Promise<Case> {
    return prisma.case.update({
      where: { id: caseId },
      data: {
        assignedUserId: userId,
        status: 'ASSIGNED',
      },
    });
  }

  async findAll(): Promise<Case[]> {
    return prisma.case.findMany({
      where: { isDeleted: false },
    });
  }

  async delete(id: string): Promise<Case> {
    return prisma.case.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
