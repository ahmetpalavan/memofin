'use server';

import { getQuestionSchema } from '~/validation/question-schema';
import { actionClient } from './safe.action';
import { prisma } from '../prisma/client';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export const voteQuestionAction = actionClient.schema(getQuestionSchema).action(async ({ parsedInput: { questionId } }) => {
  const user = await getKindeServerSession().getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
    include: {
      upvotes: {
        where: {
          authorId: user.id,
          questionId: questionId,
        },
      },
      event: {
        select: {
          slug: true,
          ownerId: true,
        },
      },
    },
  });

  if (!question) {
    throw new Error('Question not found');
  }

  if (question.isResolved) {
    return;
  }

  const wasUpVotedByUser = question.upvotes.length > 0;

  if (wasUpVotedByUser) {
    await prisma.questionUpVote.delete({
      where: {
        authorId_questionId: {
          authorId: user.id,
          questionId: questionId,
        },
      },
    });

    return true;
  }

  await prisma.$transaction([
    prisma.questionUpVote.create({
      data: {
        authorId: user.id,
        questionId,
      },
    }),
    prisma.eventParticipant.upsert({
      where: {
        eventId_userId: {
          eventId: question.eventId,
          userId: user.id,
        },
      },
      create: {
        eventId: question.eventId,
        userId: user.id,
      },
      update: {},
    }),
  ]);

  return true;
});
