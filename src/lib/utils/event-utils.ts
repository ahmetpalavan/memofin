import { Event } from '@prisma/client';
import routes, { BASE_URL } from '~/config/routes';

type Params = {
  ownerId: Event['ownerId'];
  eventSlug: Event['slug'];
};

export const getEventLink = ({ ownerId, eventSlug }: Params) => {
  return `${BASE_URL}${routes.event({
    ownerId,
    eventSlug,
  })}`;
};
