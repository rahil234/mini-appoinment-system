import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { AppointmentService } from '@/modules/appointments/appointment.service';

@injectable()
export class AppointmentController {
  constructor(
    @inject(TYPES.AppointmentService)
    private readonly _appointmentService: AppointmentService,
  ) {}

  createAppointment = async (req: Request, res: Response) => {
    const appointment = await this._appointmentService.create({
      ...req.body,
      date: new Date(req.body.date),
    });

    res.status(201).json(appointment);
  };

  updateAppointment = async (req: Request, res: Response) => {
    const appointment = await this._appointmentService.update(req.params.id, req.body);
    res.json(appointment);
  };

  listAppointments = async (req: Request, res: Response) => {
    const result = await this._appointmentService.list({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      userId: req.user.id,
      search: req.query.search as string,
      status: req.query.status as string,
      date: req.query.date as string,
    });

    res.json(result);
  };
}
