import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { AuthService } from '@/modules/auth/auth.service';

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly authService: AuthService,
  ) {}

  register = async (req: Request, res: Response) => {
    const token = await this.authService.register(req.body);
    res.status(201).json({ accessToken: token });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await this.authService.login(email, password);
    res.json({ accessToken: token });
  };
}
