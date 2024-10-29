'use server';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createQuestionSchema } from '~/validation/question-schema';
import { prisma } from '../prisma/client';
import { actionClient } from './safe.action';
import { questionDetail } from '../prisma/validators/question-validator';

export const createQuestionAction = actionClient
  .schema(createQuestionSchema)
  .action(async ({ parsedInput: { body, eventSlug, ownerId } }) => {
    const user = await getKindeServerSession().getUser();

    if (!user) {
      throw new Error('User not found');
    }

    const event = await prisma.event.findUnique({
      where: {
        slug_ownerId: {
          slug: eventSlug,
          ownerId,
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const [newQuestion] = await prisma.$transaction([
      prisma.question.create({
        data: {
          body,
          authorId: user.id,
          eventId: event.id,
          ...(event.ownerId !== user.id
            ? {
                notification: {
                  create: {
                    type: 'NEW_QUESTION',
                    userId: event.ownerId,
                    eventId: event.id,
                  },
                },
              }
            : {}),
        },
        ...questionDetail,
      }),
      prisma.eventParticipant.upsert({
        where: {
          eventId_userId: {
            eventId: event.id,
            userId: user.id,
          },
        },
        create: {
          eventId: event.id,
          userId: user.id,
        },
        update: {},
      }),
    ]);

    return newQuestion;
  });
