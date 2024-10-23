import { z } from 'zod';
import { poll } from './constant';

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

export type GetPollSchema = z.infer<typeof getPollSchema>;
export type VotePollSchema = z.infer<typeof votePollOptionSchema>;
