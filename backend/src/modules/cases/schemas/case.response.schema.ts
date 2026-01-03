import { z } from 'zod';

export const CaseStatusSchema = z.enum(['OPEN', 'ASSIGNED', 'CLOSED']);

/**
 * Single Case Response
 */
export const CaseResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  status: CaseStatusSchema,
  assignedUser: z.object({
    id: z.uuid(),
    name: z.string(),
  }).nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type CaseResponseDto = z.infer<typeof CaseResponseSchema>;

/**
 * Case List Response
 * GET /cases
 */
export const CaseListResponseSchema = z.array(CaseResponseSchema);

export type CaseListResponseDto = z.infer<typeof CaseListResponseSchema>;
