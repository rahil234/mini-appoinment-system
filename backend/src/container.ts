import { Container } from 'inversify';

import { TYPES } from '@/types/identifiers';

import { AuthService } from '@/modules/auth/auth.service';
import { UserService } from '@/modules/users/user.service';
import { AppointmentService } from '@/modules/appointments/appointment.service';
import { CaseService } from '@/modules/cases/case.service';

import { AuthController } from '@/modules/auth/auth.controller';
import { AppointmentController } from '@/modules/appointments/appointment.controller';
import { CaseController } from '@/modules/cases/case.controller';
import { UserController } from '@/modules/users/user.controller';

export const container = new Container();

/**
 * ======================
 * Services
 * ======================
 */
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container
  .bind<AppointmentService>(TYPES.AppointmentService)
  .to(AppointmentService);
container.bind<CaseService>(TYPES.CaseService).to(CaseService);

/**
 * ======================
 * Controllers
 * ======================
 */
container.bind<AuthController>(AuthController).toSelf();
container.bind<UserController>(UserController).toSelf();
container.bind<AppointmentController>(AppointmentController).toSelf();
container.bind<CaseController>(CaseController).toSelf();
