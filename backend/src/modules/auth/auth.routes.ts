import { Router } from 'express';

import { container } from '@/container';
import { AuthController } from '@/modules/auth/auth.controller';

const router = Router();

const controller = container.get(AuthController);

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.post('/refresh-token', controller.refreshToken);

export default router;
