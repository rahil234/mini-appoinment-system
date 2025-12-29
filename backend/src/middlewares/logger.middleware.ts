import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = new Date();

  res.on('finish', () => {
    const time = `${start.toLocaleTimeString('en-US', {
      hour12: false,
    })}.${start.getMilliseconds()}`;

    console.log(
      `${time} ${req.method}:${req.originalUrl}` + ` ${res.statusCode}`,
    );
  });

  next();
};
