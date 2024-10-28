'use server';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import routes from '~/config/routes';
import { deleteEventSchema } from '~/validation/event-schema';
import { prisma } from '../prisma/client';
import { actionClient } from './safe.action';

export const deleteEvent = actionClient.schema(deleteEventSchema).action(async ({ parsedInput: { eventId } }) => {
  const user = await getKindeServerSession().getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { ownerId: true },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  if (event.ownerId !== user.id) {
    throw new Error('Not authorized');
  }

  await prisma.event.delete({ where: { id: eventId } });

  redirect(routes.dashboard);
});
