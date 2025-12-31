import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { AuthService } from '@/modules/auth/auth.service';
import { clearCookies, setAccessToken, setRefreshToken } from '@/modules/auth/utils/cookie.utils';

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly _authService: AuthService,
  ) {
  }

  register = async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = await this._authService.register(req.body);

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
    } = await this._authService.login(email, password);

    setAccessToken(res, accessToken);
    setRefreshToken(res, refreshToken);

    res.json({
      message: 'Logged in successfully',
    });
  };

  logout = (_req: Request, res: Response) => {
    clearCookies(res);
    res.json({
      message: 'Logged out successfully',
    });
  };

  refreshToken = async (_req: Request, res: Response) => {
    const token = _req.cookies['refresh_token'];

    const { accessToken, refreshToken } = await this._authService.refreshTokens(token);

    setAccessToken(res, accessToken);
    setRefreshToken(res, refreshToken);

    res.json({ message: 'Refreshed successfully' });
  };
}
