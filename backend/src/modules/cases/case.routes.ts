import { Router } from 'express';

import { container } from '@/container';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role.middleware';
import { CaseController } from '@/modules/cases/case.controller';

const router = Router();
const controller = container.get(CaseController);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  controller.createCase,
);

router.put(
  '/:id/assign',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  controller.assignCase,
);

router.get('/', authMiddleware, controller.listCases);

export default router;
