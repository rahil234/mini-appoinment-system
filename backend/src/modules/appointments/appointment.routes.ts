import { Router } from 'express';

import { container } from '@/container';
import { validate } from '@/middlewares/validate';
import { authMiddleware } from '@/middlewares/auth.middleware';
import {
  AppointmentsRequestSchema,
  CreateAppointmentRequestSchema,
  DeleteAppointmentDto,
  UpdateAppointmentRequestSchema,
  UserAppointmentsRequestSchema,
} from '@/modules/appointments/schemas/appointment.request.schema';
import { AppointmentController } from '@/modules/appointments/appointment.controller';

const router = Router();

const controller = container.get(AppointmentController);

router.post(
  '/',
  authMiddleware,
  validate(CreateAppointmentRequestSchema),
  controller.createAppointment,
);

router.put(
  '/:id',
  authMiddleware,
  validate(UpdateAppointmentRequestSchema),
  controller.updateAppointment,
);

router.get(
  '/me',
  authMiddleware,
  validate(UserAppointmentsRequestSchema),
  controller.userAppointments,
);

router.get(
  '/',
  authMiddleware,
  validate(AppointmentsRequestSchema),
  controller.appointments,
);

router.delete(
  '/:id',
  authMiddleware,
  validate(DeleteAppointmentDto),
  controller.deleteAppointment,
);

export default router;
