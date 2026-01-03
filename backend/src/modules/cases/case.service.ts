import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { HttpError } from '@/utils/http-error';
import { ICaseRepository } from './repositories/case.repository.interface';
import { UserService } from '@/modules/users/user.service';

@injectable()
export class CaseService {
  constructor(
    @inject(TYPES.CaseRepository)
    private readonly caseRepository: ICaseRepository,
    @inject(TYPES.UserService)
    private readonly userService: UserService,
  ) {}

  async create(data: { title: string; description?: string }) {
    return this.caseRepository.create(data);
  }

  async assign(caseId: string, userId: string) {
    const existing = await this.caseRepository.findById(caseId);

    if (!existing) {
      throw new HttpError('Case not found', 404);
    }
    const propertyCase = await this.caseRepository.assign(caseId, userId);

    const user = await this.userService.findById(userId);

    return {
      ...propertyCase,
      assignedUser: user,
    };
  }

  async list() {
    const cases = await this.caseRepository.findAll();

    const mappedCases = Promise.all(
      cases.map(async (c) => {
        const user = c.assignedUserId
          ? await this.userService.findById(c.assignedUserId)
          : null;

        return {
          ...c,
          assignedUser: user,
        };
      }),
    );

    return mappedCases;
  }

  async delete(id: string) {
    await this.caseRepository.delete(id);
  }
}
