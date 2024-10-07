import { Event } from '@prisma/client';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

type EventRouteParams = {
  ownerId: Event['ownerId'];
  eventSlug: Event['slug'];
};

export default {
  home: '/',
  register: '/api/auth/register',
  login: '/api/auth/login',
  dashboard: '/dashboard',
  account: '/dashboard/account',
  bookmarked: '/dashboard/bookmarks',
  event: ({ eventSlug, ownerId }: EventRouteParams) => `/events/${ownerId}/${eventSlug}`,
  eventPolls: ({ eventSlug, ownerId }: EventRouteParams) => `/events/${ownerId}/${eventSlug}/polls`,
} as const;
