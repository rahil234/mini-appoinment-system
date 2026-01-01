import { Router } from 'express';

import { container } from '@/container';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { AppointmentController } from '@/modules/appointments/appointment.controller';
import { roleMiddleware } from '@/middlewares/role.middleware';
import { Roles } from '@/enums/role.enum';

const router = Router();

const controller = container.get(AppointmentController);

router.post('/', authMiddleware, controller.createAppointment);
router.put('/:id', authMiddleware, controller.updateAppointment);
router.get('/user', authMiddleware, roleMiddleware([Roles.USER]), controller.userAppointments);
router.get('/', authMiddleware, roleMiddleware([Roles.ADMIN]), controller.appointments);

export default router;
