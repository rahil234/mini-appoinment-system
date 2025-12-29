import express, { Express } from 'express';

import { loggerMiddleware } from '@/middlewares/logger.middleware';
import { errorHandlingMiddleware } from '@/middlewares/error-handling.middleware';

export const applyMiddlewares = async (app: Express) => {
  app.use(express.json());

  app.use(loggerMiddleware);

  app.use(errorHandlingMiddleware);
};
