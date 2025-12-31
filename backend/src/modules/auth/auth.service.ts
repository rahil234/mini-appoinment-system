import bcrypt from 'bcrypt';
import { injectable, inject } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { HttpError } from '@/utils/http-error';
import { UserService } from '@/modules/users/user.service';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/utils/jwt.util';

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.UserService)
    private readonly _userService: UserService,
  ) {
  }

  async register(data: { name: string; email: string; password: string }) {
    const existing = await this._userService.findByEmail(data.email);
    if (existing) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this._userService.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    const user = await this._userService.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(token: string) {

    const payload = verifyRefreshToken(token);

    if (!payload) {
      throw new HttpError('Invalid token', 401);
    }

    const user = await this._userService.findById(payload.sub);

    if (!user) {
      throw new HttpError('User not found', 401);
    }

    const accessToken = signAccessToken({
      sub: user.id,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      sub: user.id,
    });

    return { accessToken, refreshToken };
  }
}
