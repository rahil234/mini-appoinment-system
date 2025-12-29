import { Express } from 'express';

export const applyRoutes = (app: Express) => {
  app.use('/auth', authRoutes);
};
