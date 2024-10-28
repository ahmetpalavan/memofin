'use server';

import { createEventSchema } from '~/validation/event-schema';
import { actionClient } from './safe.action';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import slugify from 'slugify';
import { prisma } from '../prisma/client';
import { redirect } from 'next/navigation';
import routes from '~/config/routes';

export const createEvent = actionClient.schema(createEventSchema).action(async ({ parsedInput: { shortDescription, title } }) => {
  const user = await getKindeServerSession().getUser();

  if (!user) {
    throw new Error('User not found');
  }

  const eventSlug = slugify(title, { lower: true });

  const newEvent = await prisma.event.create({
    data: {
      ownerId: user.id,
      name: title,
      shortDescription,
      slug: eventSlug,
      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  redirect(
    routes.event({
      eventSlug: newEvent.slug,
      ownerId: user.id,
    })
  );
});
