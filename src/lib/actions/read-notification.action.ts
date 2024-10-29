'use server';

import { z } from 'zod';
import { actionClient } from './safe.action';
import { notificationIdSchema } from '~/validation/notification-schema';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { prisma } from '../prisma/client';

export const readNotificationAction = actionClient
  .schema(
    z.object({
      notificationId: notificationIdSchema,
    })
  )
  .action(async ({ parsedInput: { notificationId } }) => {
    const user = await getKindeServerSession().getUser();

    if (!user) {
      throw new Error('User not found');
    }

    await prisma.notification.update({
      data: {
        read: true,
      },
      where: {
        id: notificationId,
        AND: {
          userId: user.id,
        },
      },
    });
  });
