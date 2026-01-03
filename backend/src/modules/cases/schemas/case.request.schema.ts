import { z } from 'zod';

/**
 * ---------------------------
 * POST /cases
 * ---------------------------
 */
export const CreateCaseRequestSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title is required'),
    description: z.string().min(5, 'Description is required'),
  }),
  params: z.object({}).strict(),
  query: z.any(),
});

export type CreateCaseRequestDto = z.infer<typeof CreateCaseRequestSchema>;

/**
 * ---------------------------
 * PUT /cases/:id/assign
 * ---------------------------
 */
export const AssignCaseRequestSchema = z.object({
  body: z.object({
    userId: z.uuid('Invalid user id'),
  }),
  params: z.object({
    id: z.uuid('Invalid case id'),
  }),
  query: z.object({}).strict(),
});

export type AssignCaseRequestDto = z.infer<typeof AssignCaseRequestSchema>;

export type AssignCaseBodyDto = z.infer<typeof AssignCaseRequestSchema>['body'];

/**
 * ---------------------------
 * GET /cases
 * ---------------------------
 */
export const ListCasesRequestSchema = z.object({
  body: z.any(),
  params: z.object({}).strict(),
  query: z.any(),
});

/**
 * ---------------------------
 * DELETE /cases/:id
 * ---------------------------
 */
export const DeleteCaseRequestSchema = z.object({
  body: z.any(),
  params: z
    .object({
      id: z.uuid('Invalid case id'),
    })
    .strict(),
  query: z.any(),
});

export type DeleteCaseRequestDto = z.infer<typeof DeleteCaseRequestSchema>;
