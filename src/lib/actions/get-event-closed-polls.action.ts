'use server';

import { z } from 'zod';
import { actionClient } from './safe.action';
import { pollIdSchema } from '~/validation/poll-schema';
import { eventPublicIdSchema } from '~/validation/event-schema';
import { getEventClosedPolls } from '../server/get-event-closed-polls';

export const getEventClosedPollsAction = actionClient
  .schema(
    z
      .object({
        cursor: pollIdSchema.optional(),
        pollId: pollIdSchema.optional(),
      })
      .merge(eventPublicIdSchema)
  )
  .action(async ({ parsedInput: { eventSlug, ownerId, cursor, pollId } }) =>
    getEventClosedPolls({
      eventSlug,
      ownerId,
      cursor,
      ...(pollId ? { filters: { pollId } } : {}),
    })
  );
