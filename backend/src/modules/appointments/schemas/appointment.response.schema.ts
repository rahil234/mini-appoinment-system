import { z } from 'zod';

export const AppointmentStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED',
]);

export const AppointmentResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  status: AppointmentStatusSchema,
  date: z.iso.datetime(),
  userId: z.uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type AppointmentResponseDto = z.infer<typeof AppointmentResponseSchema>;

export const AppointmentListResponseSchema = z.object({
  data: z.array(AppointmentResponseSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
  }),
});

export type AppointmentListResponseDto = z.infer<
  typeof AppointmentListResponseSchema
>;

export const AppointmentSummaryResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  date: z.iso.datetime(),
  status: AppointmentStatusSchema,
});

export type AppointmentSummaryResponseDto = z.infer<
  typeof AppointmentSummaryResponseSchema
>;

