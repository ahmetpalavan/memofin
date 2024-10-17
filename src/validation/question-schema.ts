import { z } from 'zod';
import { question } from './constant';
import { eventPublicIdSchema } from './event-schema';

export const questionIdSchema = z.string().cuid();

export const questionBodySchema = z
  .string()
  .min(question.minLength, {
    message: `Question must be at least ${question.minLength} characters`,
  })
  .max(question.maxLength, {
    message: `Question must be at most ${question.maxLength} characters`,
  });

export const questionOrderBySchema = z.enum(['newest', 'oldest', 'most-popular']);

export const createQuestionSchema = z
  .object({
    body: questionBodySchema,
  })
  .merge(eventPublicIdSchema);

export const getQuestionSchema = z.object({
  questionId: questionIdSchema,
});

export const updateQuestionSchema = z.object({
  questionId: questionIdSchema,
  body: questionBodySchema.optional(),
  isResolved: z.boolean().optional(),
  isPinned: z.boolean().optional(),
});

export type CreateQuestionSchema = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionSchema = z.infer<typeof updateQuestionSchema>;
export type GetQuestionSchema = z.infer<typeof getQuestionSchema>;
