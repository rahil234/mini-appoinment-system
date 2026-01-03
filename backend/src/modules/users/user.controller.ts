import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { HttpError } from '@/utils/http-error';
import {
  GetUsersRequestDto,
  UpdateUserRequestDto,
} from '@/modules/users/schemas/user.request.schema';
import {
  UserResponseDto,
  UserResponseSchema,
} from '@/modules/users/schemas/user.response.schema';
import { handleRequest } from '@/common/http/handler';
import { UserService } from '@/modules/users/user.service';

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService)
    private readonly _userService: UserService,
  ) {}

  me = handleRequest<void, UserResponseDto>(async (req) => {
    const userId = req.user.id;

    const user = await this._userService.findById(userId);

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    const { password, isDeleted, ...result } = user;

    return UserResponseSchema.parse({ ...result });
  });

  users = handleRequest<GetUsersRequestDto>(async (req) => {
    const { page = 1, limit = 10, role, search } = req.query;

    const users = await this._userService.findAll({
      page: Number(page),
      limit: Number(limit),
      search: search as string,
    });

    const mappedUsers = users.map(({ password, updatedAt, ...user }) => user);

    return {
      data: mappedUsers,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: users.length,
      },
    };
  });

  updateUser = handleRequest<UpdateUserRequestDto>(async (req) => {
    const userId = req.params.id;

    await this._userService.update(userId, {
      isDeleted: req.body.isDeleted,
    });

    return {
      status: 200,
    };
  });
}
