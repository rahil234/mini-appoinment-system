import bcrypt from 'bcrypt';
import { injectable, inject } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { UserService } from '@/modules/users/user.service';
import { signAccessToken, signRefreshToken } from '@/utils/jwt.util';

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.UserService)
    private readonly userService: UserService,
  ) {
  }

  async register(data: { name: string; email: string; password: string }) {
    const existing = await this.userService.findByEmail(data.email);
    if (existing) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userService.createUser({
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
    const user = await this.userService.findByEmail(email);
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
}
