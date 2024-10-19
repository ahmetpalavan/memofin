import 'server-only';

import { Event, User } from '@prisma/client';
import { cache } from 'react';
import { prisma } from '../prisma/client';
import { pollDetails } from '../prisma/validators/poll-validator';

type Params = {
  ownerId: User['id'];
  eventSlug: Event['slug'];
};

export const getEventLivePolls = cache(async ({ ownerId, eventSlug }: Params) => {
  return await prisma.poll.findMany({
    where: {
      event: {
        ownerId,
        slug: eventSlug,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    ...pollDetails,
  });
});
