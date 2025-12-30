import { Request, Response, NextFunction } from 'express';

import { HttpError } from '@/utils/http-error';
import { verifyAccessToken } from '@/utils/jwt.util';

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies['access_token'] as string;

  if (!accessToken) {
    return next(new HttpError('Unauthorized', 401));
  }

  try {
    const payload = verifyAccessToken(accessToken);

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch {
    next(new HttpError('Invalid or expired token', 401));
  }
};
