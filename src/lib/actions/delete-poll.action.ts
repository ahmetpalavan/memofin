'use server';

import { getPollSchema } from '~/validation/poll-schema';
import { actionClient } from './safe.action';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { prisma } from '../prisma/client';
import { revalidatePath } from 'next/cache';
import routes from '~/config/routes';

export const deletePoll = actionClient.schema(getPollSchema).action(async ({ parsedInput: { pollId } }) => {
  const user = await getKindeServerSession().getUser();

  if (!user) {
    throw new Error('User not found');
  }

  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    select: {
      event: {
        select: {
          ownerId: true,
          slug: true,
        },
      },
    },
  });

  if (!poll) {
    throw new Error('Poll not found');
  }

  if (poll.event.ownerId !== user.id) {
    throw new Error('You do not have permission to delete this poll');
  }

  await prisma.poll.delete({
    where: { id: pollId },
  });

  revalidatePath(routes.eventPolls({ eventSlug: poll.event.slug, ownerId: poll.event.ownerId }));
});
