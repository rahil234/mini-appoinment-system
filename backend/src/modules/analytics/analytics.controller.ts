import { inject, injectable } from 'inversify';

import { TYPES } from '@/types/identifiers';
import { AnalyticsService } from '@/modules/analytics/analytics.service';
import { handleRequest } from '@/common/http/handler';
import { AnalyticsDashboardResponseDto } from '@/modules/analytics/schemas/analytics.response.schema';

@injectable()
export class AnalyticsController {
  constructor(
    @inject(TYPES.AnalyticsService)
    private readonly _analyticsService: AnalyticsService,
  ) {}

  getDashboard = handleRequest<unknown, AnalyticsDashboardResponseDto>(
    async (req) => {
      return this._analyticsService.getDashboardStats(
        req.user.id,
        req.user.role,
      );
    },
  );
}
