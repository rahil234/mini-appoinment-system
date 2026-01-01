import { z } from 'zod';

/**
 * ---------------------------
 * GET /analytics/dashboard
 * ---------------------------
 */
export const AnalyticsDashboardRequestSchema = z.object({
  body: z.object({}).strict(),
  params: z.object({}).strict(),
  query: z.object({}).strict(),
});
