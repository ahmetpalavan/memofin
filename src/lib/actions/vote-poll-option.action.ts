'use server';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { votePollOptionSchema } from '~/validation/poll-schema';
import { prisma } from '../prisma/client';
import { actionClient } from './safe.action';

export const votePollOption = actionClient.schema(votePollOptionSchema).action(async ({ parsedInput: { optionIndex, pollId } }) => {
  const user = await getKindeServerSession().getUser();

  if (!user) {
    throw new Error('User not found');
  }

  const poll = await prisma.poll.findUnique({
    where: {
      id: pollId,
    },
    include: {
      options: true,
      event: {
        select: {
          ownerId: true,
          slug: true,
        },
      },
      votes: {
        where: {
          authorId: user.id,
        },
      },
    },
  });

  if (!poll) {
    throw new Error('Poll not found');
  }

  if (!poll.isLive) {
    return;
  }

  const previousUserVote = poll.votes.find((vote) => vote.authorId === user.id);

  if (previousUserVote?.pollOptionId === poll.options[optionIndex].id) {
    return;
  }

  if (previousUserVote) {
    await prisma.$transaction([
      prisma.pollVote.delete({
        where: {
          authorId_pollId: {
            authorId: user.id,
            pollId,
          },
        },
      }),
      prisma.pollVote.create({
        data: {
          pollId,
          authorId: user.id,
          pollOptionId: poll.options[optionIndex].id,
        },
      }),
    ]);

    return true;
  }

  // Create a new vote
  await prisma.$transaction([
    prisma.pollVote.create({
      data: {
        pollId,
        authorId: user.id,
        pollOptionId: poll.options[optionIndex].id,
      },
    }),
    prisma.eventParticipant.upsert({
      where: {
        eventId_userId: {
          eventId: poll.eventId,
          userId: user.id,
        },
      },
      update: {},
      create: {
        eventId: poll.eventId,
        userId: user.id,
      },
    }),
  ]);

  return true;
});
