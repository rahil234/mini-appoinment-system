import { z } from 'zod';

/**
 * ---------------------------
 * GET /users/me
 * ---------------------------
 */
export const GetMeRequestSchema = z.object({
  body: z.any(),
  params: z.object({}).strict(),
  query: z.any(),
});

/**
 * ---------------------------
 * GET /users
 * ---------------------------
 */
export const GetUsersRequestSchema = z.object({
  body: z.any(),
  params: z.object({}).strict(),
  query: z.object({
    page: z
      .string()
      .optional()
      .transform(Number)
      .refine((v) => !v || v > 0, 'Page must be > 0'),

    limit: z
      .string()
      .optional()
      .transform(Number)
      .refine((v) => !v || v > 0, 'Limit must be > 0'),

    role: z.enum(['ADMIN', 'USER']).optional(),

    search: z.string().min(1).optional(),
  }),
});

export type GetUsersRequestDto = z.infer<typeof GetUsersRequestSchema>;

export const UpdateUserRequestSchema = z.object({
  body: z.object({
    isDeleted: z.boolean('isDeleted must be a boolean'),
  }),
  params: z.object({
    id: z.uuid('Invalid user id'),
  }),
});

export type UpdateUserRequestDto = z.infer<typeof UpdateUserRequestSchema>;
