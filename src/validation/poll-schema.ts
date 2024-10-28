import { z } from 'zod';
import { poll } from './constant';
import { eventIdSchema } from './event-schema';

export const pollIdSchema = z.string().cuid();

export const votePollOptionSchema = z.object({
  pollId: pollIdSchema,
  optionIndex: z
    .number()
    .max(poll.options.maxCount - 1)
    .min(0),
});

export const getPollSchema = z.object({
  pollId: pollIdSchema,
});

export const createLivePollSchema = z.object({
  eventId: eventIdSchema,
  body: z
    .string()
    .min(poll.body.minLength, {
      message: `Poll body must be at least ${poll.body.minLength} characters`,
    })
    .max(poll.body.maxLength, {
      message: `Poll body must be at most ${poll.body.maxLength} characters`,
    }),
  options: z.array(
    z
      .string()
      .min(poll.options.minLength, {
        message: `Poll option must be at least ${poll.options.minLength} characters`,
      })
      .max(poll.options.maxLength, {
        message: `Poll option must be at most ${poll.options.maxLength} characters`,
      })
  ),
});

export type CreateLivePollSchema = z.infer<typeof createLivePollSchema>;
export type GetPollSchema = z.infer<typeof getPollSchema>;
export type VotePollSchema = z.infer<typeof votePollOptionSchema>;
