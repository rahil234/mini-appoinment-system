import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { AuthService } from '@/modules/auth/auth.service';
import {
  clearCookies,
  setAccessToken,
  setRefreshToken,
} from '@/modules/auth/utils/cookie.utils';
import {
  LoginRequestDto,
  RegisterRequestDto,
} from '@/modules/auth/schemas/auth.request.schema';
import { handleRequest } from '@/common/http/handler';

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly _authService: AuthService,
  ) {}

  register = handleRequest<RegisterRequestDto, { message: string }>(
    async (req, res) => {
      const { accessToken, refreshToken } = await this._authService.register(
        req.body,
      );

      setAccessToken(res, accessToken);
      setRefreshToken(res, refreshToken);

      return {
        status: 201,
        body: {
          message: 'User registered successfully',
        },
      };
    },
  );

  login = handleRequest<LoginRequestDto, { message: string }>(
    async (req, res) => {
      const { email, password } = req.body;

      const { accessToken, refreshToken } = await this._authService.login(
        email,
        password,
      );

      setAccessToken(res, accessToken);
      setRefreshToken(res, refreshToken);

      return {
        message: 'Logged in successfully',
      };
    },
  );

  logout = handleRequest(async (_req, res) => {
    clearCookies(res);

    return {
      message: 'Logged out successfully',
    };
  });

  refreshToken = handleRequest(async (_req, res) => {
    const token = _req.cookies['refresh_token'];

    const { accessToken, refreshToken } =
      await this._authService.refreshTokens(token);

    setAccessToken(res, accessToken);
    setRefreshToken(res, refreshToken);

    return { message: 'Refreshed successfully' };
  });
}
