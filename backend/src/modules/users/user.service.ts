import { injectable } from 'inversify';

import { prisma } from '@/config/prisma';

@injectable()
export class UserService {
  async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: { email, isDeleted: false },
    });
  }

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
}
