import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { UserService } from '@/modules/users/user.service';
import { HttpError } from '@/utils/http-error';

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService)
    private readonly _userService: UserService,
  ) {
  }

  me = async (req: Request, res: Response) => {
    const userId = req.user.id;

    const user = await this._userService.findById(userId);

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    const { password, isDeleted, updatedAt, ...result } = user;

    res.status(201).json(result);
  };
}
