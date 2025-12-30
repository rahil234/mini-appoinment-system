import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { AppointmentService } from '@/modules/appointments/appointment.service';


@injectable()
export class AppointmentController {
  constructor(
    @inject(TYPES.AppointmentService)
    private readonly service: AppointmentService,
  ) {}

  createAppointment = async (req: Request, res: Response) => {
    const appointment = await this.service.create({
      ...req.body,
      date: new Date(req.body.date),
    });

    res.status(201).json(appointment);
  };

  updateAppointment = async (req: Request, res: Response) => {
    const appointment = await this.service.update(req.params.id, req.body);
    res.json(appointment);
  };

  listAppointments = async (req: Request, res: Response) => {
    const result = await this.service.list({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      status: req.query.status as string,
      userId: req.query.userId as string,
      date: req.query.date as string,
    });

    res.json(result);
  };
}
