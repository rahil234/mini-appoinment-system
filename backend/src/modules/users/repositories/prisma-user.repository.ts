import { injectable } from 'inversify';

import { User } from '@prisma/client';
import { prisma } from '@/config/prisma.config';
import { IUserRepository } from '@/modules/users/repositories/user.repository.interface';

@injectable()
export class PrismaUserRepository implements IUserRepository {
  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'USER';
  }): Promise<User> {
    return prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { id, isDeleted: false },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { email, isDeleted: false },
    });
  }

  async findAll({ page = 1, limit = 10, search = '' }): Promise<User[]> {
    const where = {
      name: search ? { contains: search } : undefined,
      email: search ? { contains: search } : undefined,
    };

    return prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}
