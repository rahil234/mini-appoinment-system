import { Request, Response, NextFunction } from 'express';

import { HttpResponse } from '@/common/http/http-response';

type RequestFromDto<T> = Request<
  T extends { params: infer P } ? P : unknown,
  any,
  T extends { body: infer B } ? B : unknown,
  T extends { query: infer Q } ? Q : unknown
>;

type TypedRequest<
  TBody = unknown,
  TQuery = unknown,
  TParams = unknown,
> = Request<TParams, any, TBody, TQuery>;

type HandlerResult<T> = HttpResponse<T> | T | void;

export const handleRequest =
  <TRequest, TResponse = unknown>(
    handler: (
      req: RequestFromDto<TRequest>,
      res: Response,
    ) => Promise<HandlerResult<TResponse>>,
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await handler(req as RequestFromDto<TRequest>, res);

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
