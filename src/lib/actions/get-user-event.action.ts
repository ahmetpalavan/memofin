'use server';

import { z } from 'zod';
import { eventIdSchema } from '~/validation/event-schema';
import { getUserBookmarkedEvents } from '../server/get-user-bookmarked-events';
import { actionClient } from './safe.action';

export const getUserEvent = actionClient
  .schema(
    z.object({
      cursor: eventIdSchema.optional(),
    })
  )
  .action(async ({ parsedInput: { cursor } }) => getUserBookmarkedEvents({ cursor }));
