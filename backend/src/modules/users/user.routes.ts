import { Router } from 'express';

import { container } from '@/container';
import { UserController } from '@/modules/users/user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate';
import {
  GetMeRequestSchema,
  GetUsersRequestSchema,
  UpdateUserRequestSchema,
} from '@/modules/users/schemas/user.request.schema';

const router = Router();

const controller = container.get(UserController);

router.get('/me', authMiddleware, validate(GetMeRequestSchema), controller.me);

router.get(
  '/',
  authMiddleware,
  validate(GetUsersRequestSchema),
  controller.users,
);

router.put(
  '/:id',
  authMiddleware,
  validate(UpdateUserRequestSchema),
  controller.updateUser,
);

export default router;
