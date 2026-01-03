import { Router } from 'express';

import { container } from '@/container';
import { validate } from '@/middlewares/validate';
import {
  AssignCaseRequestSchema,
  CreateCaseRequestSchema,
  DeleteCaseRequestSchema,
  ListCasesRequestSchema,
} from '@/modules/cases/schemas/case.request.schema';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role.middleware';
import { CaseController } from '@/modules/cases/case.controller';

const router = Router();
const controller = container.get(CaseController);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  validate(CreateCaseRequestSchema),
  controller.createCase,
);

router.put(
  '/:id/assign',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  validate(AssignCaseRequestSchema),
  controller.assignCase,
);

router.get(
  '/',
  authMiddleware,
  validate(ListCasesRequestSchema),
  controller.listCases,
);

router.delete(
  '/:id',
  authMiddleware,
  validate(DeleteCaseRequestSchema),
  controller.deleteCase,
);

export default router;
