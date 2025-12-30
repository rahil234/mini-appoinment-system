import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';

import { loggerMiddleware } from '@/middlewares/logger.middleware';
import { errorHandlingMiddleware } from '@/middlewares/error-handling.middleware';

export const applyMiddlewares = async (app: Express) => {
  const corsOrigins = process.env.CORS_ORIGINS?.split(',') || '*';

  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
    }),
  );

  app.use(cookieParser());

  app.use(express.json());

  app.use(loggerMiddleware);

  app.use(errorHandlingMiddleware);
};
