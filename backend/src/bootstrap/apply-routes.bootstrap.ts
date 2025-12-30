import { Express } from 'express';

import authRoute from '@/modules/auth/auth.routes';
import userRoutes from '@/modules/users/user.routes';
import caseRoutes from '@/modules/cases/case.routes';
import appointmentRoutes from '@/modules/appointments/appointment.routes';

export const applyRoutes = (app: Express) => {
  app.use('/auth', authRoute);
  app.use('/users', userRoutes);
  app.use('/appointments', appointmentRoutes);
  app.use('/cases', caseRoutes);
};
