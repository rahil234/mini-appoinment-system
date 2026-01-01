import { Request, Response, NextFunction } from 'express';

import { HttpResponse } from '@/common/http/http-response';

type TypedRequest<
  TBody = unknown,
  TQuery = unknown,
  TParams = unknown,
> = Request<TParams, any, TBody, TQuery>;

type HandlerResult<T> = HttpResponse<T> | T | void;

export const handleRequest =
  <TBody = unknown, TResponse = unknown, TQuery = unknown, TParams = unknown>(
    handler: (
      req: TypedRequest<TBody, TQuery, TParams>,
      res: Response,
    ) => Promise<HandlerResult<TResponse>>,
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await handler(
        req as TypedRequest<TBody, TQuery, TParams>,
        res,
      );

      if (!result) return;

      if (typeof result === 'object' && 'body' in result) {
        res.status(result.status ?? 200).json(result.body);
      } else {
        res.json(result);
      }
    } catch (err) {
      next(err);
    }
  };
