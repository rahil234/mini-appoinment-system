import { User } from '@prisma/client';

export interface IUserRepository {
  create(data: {
    name: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'USER';
  }): Promise<User>;

  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  findAll({
    page,
    limit,
    search,
    role,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    role?: 'ADMIN' | 'USER';
  }): Promise<User[]>;

  update(id: string, data: Partial<User>): Promise<User>;
}
