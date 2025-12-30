import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { CaseService } from '@/modules/cases/case.service';


@injectable()
export class CaseController {
  constructor(
    @inject(TYPES.CaseService)
    private readonly service: CaseService,
  ) {}

  createCase = async (req: Request, res: Response) => {
    const result = await this.service.create(req.body);
    res.status(201).json(result);
  };

  assignCase = async (req: Request, res: Response) => {
    const result = await this.service.assign(req.params.id, req.body.userId);
    res.json(result);
  };

  listCases = async (_req: Request, res: Response) => {
    const cases = await this.service.list();
    res.json(cases);
  };
}
