'use server';

import { z } from 'zod';
import { actionClient } from './safe.action';
import { eventIdSchema } from '~/validation/event-schema';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { prisma } from '../prisma/client';

export const bookmarkEvent = actionClient.schema(z.object({ eventId: eventIdSchema })).action(async ({ parsedInput: { eventId } }) => {
  const user = await getKindeServerSession().getUser();

  if (!user) {
    throw new Error('User not found');
  }

  const eventWithBookmarks = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      bookmarkedBy: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!eventWithBookmarks) {
    throw new Error('Event not found');
  }

  const isBookmarked = eventWithBookmarks.bookmarkedBy.some((bookmarkedBy) => bookmarkedBy.id === user.id);

  if (isBookmarked) {
    await prisma.event.update({
      where: { id: eventId },
      data: {
        bookmarkedBy: {
          disconnect: {
            id: user.id,
          },
        },
      },
    });
  } else {
    await prisma.event.update({
      where: { id: eventId },
      data: {
        bookmarkedBy: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }
});
