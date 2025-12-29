import { Container } from 'inversify';
import { TYPES } from '@/types/identifiers';

import { AuthService } from '@/modules/auth/auth.service';
import { UserService } from '@/modules/users/user.service';
import { AuthController } from '@/modules/auth/auth.controller';

export const container = new Container();

container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);

container.bind<AuthController>(AuthController).toSelf();
