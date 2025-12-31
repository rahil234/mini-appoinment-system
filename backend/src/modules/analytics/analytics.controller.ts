import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { AnalyticsService } from '@/modules/analytics/analytics.service';

@injectable()
export class AnalyticsController {
  constructor(
    @inject(TYPES.AnalyticsService)
    private readonly _analyticsService: AnalyticsService,
  ) {}

  getDashboard = async (req: Request, res: Response) => {
    const data = await this._analyticsService.getDashboardStats(
      req.user.id,
      req.user.role,
    );

    res.json(data);
  };
}
