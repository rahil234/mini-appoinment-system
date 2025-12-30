import { Router } from 'express';

import { container } from '@/container';
import { UserController } from '@/modules/users/user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();

const controller = container.get(UserController);

router.get('/me', authMiddleware, controller.me);

export default router;
