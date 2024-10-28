'use server';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createLivePollSchema } from '~/validation/poll-schema';
import { prisma } from '../prisma/client';
import { actionClient, CustomError } from './safe.action';
import { revalidatePath } from 'next/cache';
import routes from '~/config/routes';

export const createLivePollAction = actionClient
  .schema(createLivePollSchema)
  .action(async ({ parsedInput: { body, eventId, options } }) => {
    const user = await getKindeServerSession().getUser();

    if (!user) {
      throw new Error('User not found');
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        slug: true,
        ownerId: true,
        _count: {
          select: {
            polls: {
              where: { isLive: true },
            },
          },
        },
      },
    });

    if (!event) {
      throw new CustomError('Event not found');
    }

    if (event.ownerId !== user.id) {
      throw new CustomError('User is not the owner of the event');
    }

    if (event._count.polls > 0) {
      throw new CustomError('There is already a live poll for this event');
    }

    await prisma.poll.create({
      data: {
        body,
        isLive: true,
        event: { connect: { id: eventId } },
        options: {
          createMany: {
            data: options.map((option, index) => ({
              body: option,
              index,
            })),
          },
        },
      },
    });

    revalidatePath(
      routes.eventPolls({
        eventSlug: event.slug,
        ownerId: user.id,
      })
    );
  });
