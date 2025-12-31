import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { HttpError } from '@/utils/http-error';
import { UserService } from '@/modules/users/user.service';

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

  users = async (req: Request, res: Response) => {
    const users = await this._userService.findAll();

    const result = users.map(
      ({ password, isDeleted, updatedAt, ...user }) => user,
    );

    res.json(result);
  };
}
