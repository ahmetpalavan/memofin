'use server';

import { z } from 'zod';
import { actionClient } from './safe.action';
import { notificationIdSchema } from '~/validation/notification-schema';
import { getUserNotifications } from '../server/get-user-notification';

export const getUserNotificationAction = actionClient
  .schema(
    z.object({
      cursor: notificationIdSchema.optional(),
    })
  )
  .action(async ({ parsedInput: { cursor } }) => {
    return getUserNotifications({ cursor });
  });
