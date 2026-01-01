import { Request, Response, NextFunction } from 'express';

import { HttpError } from '@/utils/http-error';
import { UserRole } from '@/types';

export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpError('Unauthorized', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new HttpError('Forbidden', 403));
    }

    next();
  };
};
