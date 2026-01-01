import { z } from 'zod';

/**
 * Appointment stats
 */
export const AppointmentStatsSchema = z.object({
  total: z.number(),
  pending: z.number(),
  confirmed: z.number(),
  cancelled: z.number(),
});

/**
 * Case stats (ADMIN only)
 */
export const CaseStatsSchema = z.object({
  total: z.number(),
  unassigned: z.number(),
});

/**
 * Recent appointment summary
 */
export const RecentAppointmentSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  date: z.iso.datetime(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
});

/**
 * Dashboard analytics response
 */
export const AnalyticsDashboardResponseSchema = z.object({
  appointments: AppointmentStatsSchema,
  recentAppointments: z.array(RecentAppointmentSchema),

  // Only present for ADMIN users
  cases: CaseStatsSchema.optional(),
});

export type AnalyticsDashboardResponseDto = z.infer<
  typeof AnalyticsDashboardResponseSchema
>;
