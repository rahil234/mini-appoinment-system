import { Response, NextFunction } from 'express';

import { HttpError } from '@/utils/http-error';
import { AuthRequest } from '@/middlewares/auth.middleware';

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpError('Unauthorized', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new HttpError('Forbidden', 403));
    }

    next();
  };
};
