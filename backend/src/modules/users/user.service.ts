import { injectable } from 'inversify';

import { prisma } from '@/config/prisma.config';

@injectable()
export class UserService {
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'USER';
  }) {
    return prisma.user.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.user.findFirst({
      where: { id, isDeleted: false },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: { email, isDeleted: false },
    });
  }

  async findAll() {
    return prisma.user.findMany();
  }
}
