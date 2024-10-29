'use server';

import { z } from 'zod';
import { eventIdSchema } from '~/validation/event-schema';
import { getUserEvents } from '../server/get-user-events';
import { actionClient } from './safe.action';

export const getBookmarkedEvent = actionClient
  .schema(
    z.object({
      cursor: eventIdSchema.optional(),
    })
  )
  .action(async ({ parsedInput: { cursor } }) =>
    getUserEvents({
      cursor,
    })
  );
