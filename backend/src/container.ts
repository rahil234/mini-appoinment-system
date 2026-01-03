import { Container } from 'inversify';

import { TYPES } from '@/types/identifiers';

import { AuthService } from '@/modules/auth/auth.service';
import { UserService } from '@/modules/users/user.service';
import { CaseService } from '@/modules/cases/case.service';
import { AnalyticsService } from '@/modules/analytics/analytics.service';
import { AppointmentService } from '@/modules/appointments/appointment.service';

import { AuthController } from '@/modules/auth/auth.controller';
import { CaseController } from '@/modules/cases/case.controller';
import { UserController } from '@/modules/users/user.controller';
import { AnalyticsController } from '@/modules/analytics/analytics.controller';
import { AppointmentController } from '@/modules/appointments/appointment.controller';

import { IUserRepository } from '@/modules/users/repositories/user.repository.interface';
import { PrismaUserRepository } from '@/modules/users/repositories/prisma-user.repository';
import { IAppointmentRepository } from '@/modules/appointments/repositories/appointment.repository.interface';
import { PrismaAppointmentRepository } from '@/modules/appointments/repositories/prisma-appointment.repository';
import { ICaseRepository } from '@/modules/cases/repositories/case.repository.interface';
import { PrismaCaseRepository } from '@/modules/cases/repositories/prisma-case.repository';

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
container.bind<AnalyticsService>(TYPES.AnalyticsService).to(AnalyticsService);

/**
 * ======================
 * Controllers
 * ======================
 */
container.bind<AuthController>(AuthController).toSelf();
container.bind<UserController>(UserController).toSelf();
container.bind<AppointmentController>(AppointmentController).toSelf();
container.bind<CaseController>(CaseController).toSelf();
container.bind<AnalyticsController>(AnalyticsController).toSelf();

/**
 * ======================
 * Repositories
 * ======================
 */
container.bind<IUserRepository>(TYPES.UserRepository).to(PrismaUserRepository);
container
  .bind<IAppointmentRepository>(TYPES.AppointmentRepository)
  .to(PrismaAppointmentRepository);
container.bind<ICaseRepository>(TYPES.CaseRepository).to(PrismaCaseRepository);
