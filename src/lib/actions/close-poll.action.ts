'use server';

import { getPollSchema } from '~/validation/poll-schema';
import { actionClient } from './safe.action';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { prisma } from '../prisma/client';
import { revalidatePath } from 'next/cache';
import routes from '~/config/routes';

export const closePoll = actionClient.schema(getPollSchema).action(async ({ parsedInput: { pollId } }) => {
  const user = await getKindeServerSession().getUser();

  if (!user) {
    throw new Error('User not found');
  }

  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    select: {
      event: {
        select: {
          id: true,
          slug: true,
          ownerId: true,
        },
      },
      votes: {
        select: {
          authorId: true,
        },
      },
    },
  });

  if (!poll) {
    throw new Error('Poll not found');
  }

  if (poll.event.ownerId !== user.id) {
    throw new Error('You do not have permission to close this poll');
  }

  await prisma.poll.update({
    where: { id: pollId },
    data: { isLive: false },
  });

  revalidatePath(routes.eventPolls({ eventSlug: poll.event.slug, ownerId: poll.event.ownerId }));
});
