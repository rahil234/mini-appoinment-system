import { Router } from 'express';

import { container } from '@/container';
import { validate } from '@/middlewares/validate';
import { AuthController } from '@/modules/auth/auth.controller';
import {
  LoginRequestSchema,
  RegisterRequestSchema,
} from '@/modules/auth/schemas/auth.request.schema';

const router = Router();

const controller = container.get(AuthController);

router.post('/register', validate(RegisterRequestSchema), controller.register);
router.post('/login', validate(LoginRequestSchema), controller.login);
router.post('/logout', controller.logout);
router.post('/refresh-token', controller.refreshToken);

export default router;
