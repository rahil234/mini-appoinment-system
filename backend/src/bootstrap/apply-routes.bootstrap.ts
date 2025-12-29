import { Express } from 'express';
import authRoute from '@/routes/auth.route';

export const applyRoutes = (app: Express) => {
  app.use('/auth', authRoute);
};
