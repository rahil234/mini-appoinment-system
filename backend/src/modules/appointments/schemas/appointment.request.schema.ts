import { z } from 'zod';

const paginationQuery = {
  page: z
    .string()
    .optional()
    .transform(Number)
    .refine((v) => !v || v > 0, 'Page must be greater than 0'),

  limit: z
    .string()
    .optional()
    .transform(Number)
    .refine((v) => !v || v > 0, 'Limit must be greater than 0'),
};

const statusEnum = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']);

export const CreateAppointmentRequestSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title is required'),
    date: z.iso.datetime('Invalid date format'),
    description: z.string().optional(),
  }),
  params: z.object({}).strict(),
  query: z.any(),
});

export type CreateAppointmentDto = z.infer<
  typeof CreateAppointmentRequestSchema
>['body'];

export const UpdateAppointmentRequestSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    date: z.iso.datetime().optional(),
    status: statusEnum.optional(),
    description: z.string().optional(),
  }),
  params: z.object({
    id: z.uuid('Invalid appointment id'),
  }),
  query: z.any(),
});

export type UpdateAppointmentBodyDto = z.infer<
  typeof UpdateAppointmentRequestSchema
>['body'];

export type UpdateAppointmentParamsDto = z.infer<
  typeof UpdateAppointmentRequestSchema
>['params'];

export const UserAppointmentsRequestSchema = z.object({
  body: z.any(),
  params: z.object({}).strict(),
  query: z.object({
    ...paginationQuery,
    search: z.string().optional(),
    status: statusEnum.optional(),
    date: z.string().optional(), // yyyy-mm-dd or ISO
  }),
});

export type UserAppointmentsQueryDto = z.infer<
  typeof UserAppointmentsRequestSchema
>['query'];

export const AppointmentsRequestSchema = z.object({
  body: z.any(),
  params: z.object({}).strict(),
  query: z.object({
    ...paginationQuery,
    userId: z.uuid().optional(),
    search: z.string().optional(),
    status: statusEnum.optional(),
    date: z.string().optional(),
  }),
});

export type AppointmentsQueryDto = z.infer<
  typeof AppointmentsRequestSchema
>['query'];

export const DeleteAppointmentDto = z.object({
  params: z.object({
    id: z.uuid('Invalid appointment id'),
  }),
});

export type DeleteAppointmentParamsDto = z.infer<
  typeof DeleteAppointmentDto
>['params'];
