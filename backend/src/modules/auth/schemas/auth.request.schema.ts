import { z } from 'zod';

/**
 * Shared fields
 */
const email = z.email('Invalid email address');
const password = z.string().min(6, 'Password must be at least 8 characters');

/**
 * ---------------------------
 * POST /auth/register
 * ---------------------------
 */
export const RegisterRequestSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email,
    password,
  }),
  params: z.object({}).strict(),
  query: z.object({}).strict(),
});

export type RegisterRequestDto = z.infer<typeof RegisterRequestSchema>['body'];

/**
 * ---------------------------
 * POST /auth/login
 * ---------------------------
 */
export const LoginRequestSchema = z.object({
  body: z.object({
    email,
    password,
  }),
  params: z.object({}).strict(),
  query: z.object({}).strict(),
});

export type LoginRequestDto = z.infer<typeof LoginRequestSchema>['body'];
