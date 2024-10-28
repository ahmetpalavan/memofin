'use server';

import { updateEventSchema } from '~/validation/event-schema';
import { actionClient } from './safe.action';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { prisma } from '../prisma/client';
import { revalidatePath } from 'next/cache';
import routes from '~/config/routes';

export const updateEventAction = actionClient.schema(updateEventSchema).action(async ({ parsedInput: { eventId, shortDescription } }) => {
  const user = await getKindeServerSession().getUser();

  if (!user) {
    throw new Error('User not found');
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      ownerId: true,
      slug: true,
    },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  if (event.ownerId !== user.id) {
    throw new Error('User is not the owner of the event');
  }

  await prisma.event.update({
    where: { id: eventId },
    data: { shortDescription },
  });

  revalidatePath(routes.event({ eventSlug: event.slug, ownerId: user.id }));
});
