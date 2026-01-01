import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { HttpError } from '@/utils/http-error';
import { handleRequest } from '@/common/http/handler';
import { UserService } from '@/modules/users/user.service';
import { GetUsersQueryDto } from '@/modules/users/schemas/user.request.schema';

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService)
    private readonly _userService: UserService,
  ) {}

  me = handleRequest(async (req, res) => {
    const userId = req.user.id;

    const user = await this._userService.findById(userId);

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    const { password, isDeleted, updatedAt, ...result } = user;

    return result;
  });

  users = handleRequest<unknown, any, GetUsersQueryDto>(async (req, res) => {
    const { page = 1, limit = 10, role, search } = req.query;

    const users = await this._userService.findAll();

    const result = users.map(
      ({ password, isDeleted, updatedAt, ...user }) => user,
    );

    return result;
  });
}
