import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { IUserRepository } from '@/modules/users/repositories/user.repository.interface';


@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'USER';
  }) {
    return this.userRepository.create(data);
  }

  async findById(id: string) {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findAll({
    page = 1,
    limit = 10,
    search = '',
  }) {
    return this.userRepository.findAll({
      page,
      limit,
      search,
    });
  }

  async update(id: string, data: any) {
    return this.userRepository.update(id, data);
  }
}
