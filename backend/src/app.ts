import express from 'express';

import '@/config/env.config';
import { applyRoutes } from '@/bootstrap/apply-routes.bootstrap';
import { applyMiddlewares } from '@/bootstrap/apply-middlewares.bootstrap';

export async function createApp() {
  const app = express();

  await applyMiddlewares(app);

  applyRoutes(app);

  return app;
}
