'use server';

import { getQuestionSchema } from '~/validation/question-schema';
import { actionClient } from './safe.action';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { prisma } from '../prisma/client';
import { revalidatePath } from 'next/cache';
import routes from '~/config/routes';

export const deleteQuestionAction = actionClient.schema(getQuestionSchema).action(async ({ parsedInput: { questionId } }) => {
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

  await prisma.question.delete({
    where: {
      id: questionId,
    },
  });

  revalidatePath(
    routes.event({
      eventSlug: question.event.slug,
      ownerId: question.event.ownerId,
    })
  );
});
