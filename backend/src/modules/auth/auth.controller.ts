import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { AuthService } from '@/modules/auth/auth.service';
import { setAccessToken, setRefreshToken } from '@/modules/auth/utils/cookie.utils';

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly authService: AuthService,
  ) {
  }

  register = async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = await this.authService.register(req.body);

    setAccessToken(res, accessToken);
    setRefreshToken(res, refreshToken);

    res.status(201).json({
      message: 'User registered successfully',
    });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const {
      accessToken,
      refreshToken,
    } = await this.authService.login(email, password);

    setAccessToken(res, accessToken);
    setRefreshToken(res, refreshToken);

    res.json({
      message: 'Logged in successfully',
    });
  };
}
