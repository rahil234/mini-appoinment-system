import { Express } from 'express';

import authRoute from '@/modules/auth/auth.routes';
import userRoutes from '@/modules/users/user.routes';
import caseRoutes from '@/modules/cases/case.routes';
import appointmentRoutes from '@/modules/appointments/appointment.routes';

export const applyRoutes = (app: Express) => {
  app.use('/api/auth', authRoute);
  app.use('/api/users', userRoutes);
  app.use('/api/appointments', appointmentRoutes);
  app.use('/api/cases', caseRoutes);
};
