import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { handleRequest } from '@/common/http/handler';
import {
  AppointmentsQueryDto,
  CreateAppointmentDto,
  DeleteAppointmentParamsDto,
  UpdateAppointmentBodyDto,
  UpdateAppointmentParamsDto,
  UserAppointmentsQueryDto,
} from '@/modules/appointments/schemas/appointment.request.schema';
import { AppointmentService } from '@/modules/appointments/appointment.service';

@injectable()
export class AppointmentController {
  constructor(
    @inject(TYPES.AppointmentService)
    private readonly _appointmentService: AppointmentService,
  ) {}

  createAppointment = handleRequest<CreateAppointmentDto>(async (req) => {
    await this._appointmentService.create({
      ...req.body,
      userId: req.user.id,
      date: new Date(req.body.date),
    });

    return {
      status: 201,
    };
  });

  updateAppointment = handleRequest<
    UpdateAppointmentBodyDto,
    unknown,
    unknown,
    UpdateAppointmentParamsDto
  >(async (req) => {
    const userId = req.user.id;

    return this._appointmentService.update(req.params.id, userId, req.body);
  });

  userAppointments = handleRequest<unknown, unknown, UserAppointmentsQueryDto>(
    async (req) => {
      return this._appointmentService.list({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        userId: req.user.id,
        search: req.query.search as string,
        status: req.query.status as string,
        date: req.query.date as string,
      });
    },
  );

  appointments = handleRequest<unknown, unknown, AppointmentsQueryDto>(
    async (req) => {
      return this._appointmentService.list({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        userId: req.query.userId as string,
        search: req.query.search as string,
        status: req.query.status as string,
        date: req.query.date as string,
      });
    },
  );

  deleteAppointment = handleRequest<
    unknown,
    unknown,
    unknown,
    DeleteAppointmentParamsDto
  >(async (req) => {
    await this._appointmentService.update(req.params.id, req.user.id, {
      isDeleted: true,
    });
    return { status: 204 };
  });
}
