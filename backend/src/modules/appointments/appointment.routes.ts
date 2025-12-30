import { Router } from 'express';

import { container } from '@/container';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { AppointmentController } from '@/modules/appointments/appointment.controller';

const router = Router();
const controller = container.get(AppointmentController);

router.post('/', authMiddleware, controller.createAppointment);
router.put('/:id', authMiddleware, controller.updateAppointment);
router.get('/', authMiddleware, controller.listAppointments);

export default router;
