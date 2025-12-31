import { Router } from 'express';

import { container } from '@/container';
import { AnalyticsController } from '@/modules/analytics/analytics.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();

const controller = container.get(AnalyticsController);

router.get('/dashboard', authMiddleware, controller.getDashboard);

export default router;
