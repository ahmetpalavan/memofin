import 'server-only';

import { Event, User } from '@prisma/client';
import { cache } from 'react';
import { prisma } from '../prisma/client';
import { eventDetail } from '../prisma/validators/event-validator';

type Params = {
  ownerId: User['id'];
  eventSlug: Event['slug'];
};

export const getEventDetail = cache(async ({ eventSlug, ownerId }: Params) => {
  return await prisma.event.findFirstOrThrow({
    where: {
      slug: eventSlug,
      ownerId,
    },
    include: eventDetail.include,
  });
});
