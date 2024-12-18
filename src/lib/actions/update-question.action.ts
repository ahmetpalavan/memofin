'use server';

import { updateQuestionSchema } from '~/validation/question-schema';
import { actionClient } from './safe.action';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { prisma } from '../prisma/client';

export const updateQuestionAction = actionClient.schema(updateQuestionSchema).action(async ({ parsedInput: { questionId, ...fields } }) => {
  const user = await getKindeServerSession().getUser();

  if (!user) {
    throw new Error('User not found');
  }

  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
    select: {
      event: {
        select: {
          ownerId: true,
          id: true,
          slug: true,
        },
      },
      authorId: true,
    },
  });

  if (!question) {
    throw new Error('Question not found');
  }

  if (question.event.ownerId !== user.id && question.authorId !== user.id) {
    throw new Error('Unauthorized');
  }

  await prisma.$transaction([
    prisma.question.update({
      where: {
        id: questionId,
      },
      data: fields,
    }),
    ...[
      fields.isResolved === true && question.authorId !== user.id
        ? prisma.notification.create({
            data: {
              type: 'QUESTION_RESOLVED',
              questionId,
              userId: question.authorId,
              eventId: question.event.id,
            },
          })
        : [],
      fields.isPinned === true && question.authorId !== user.id
        ? prisma.notification.create({
            data: {
              type: 'QUESTION_PINNED',
              questionId,
              userId: question.authorId,
              eventId: question.event.id,
            },
          })
        : [],
    ].flatMap((x) => x),
  ]);

  return { questionId, ...fields };
});
