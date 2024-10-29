'use client';

import { Event } from '@prisma/client';
import { useAction } from 'next-safe-action/hooks';
import { useCallback, useState } from 'react';
import { getBookmarkedEvent } from '~/lib/actions/get-user-bookmarked-event.action';
import { getUserEvent } from '~/lib/actions/get-user-event.action';
import { EventDetail } from '~/lib/prisma/validators/event-validator';
import { EventCard } from './event-card';
import { InfiniteScrollList } from './infinite-scroll-list';

interface EventsListProps {
  initialEvents: EventDetail[];
}

export const EventsList = ({ initialEvents }: EventsListProps) => {
  const [events, setEvents] = useState(initialEvents);

  const { executeAsync } = useAction(getUserEvent);

  const fetchMoreEvents = useCallback(
    async ({ cursor }: { cursor?: Event['id'] }) => {
      const newEvents = await executeAsync({ cursor });

      if (!newEvents?.data || newEvents.data.length === 0) {
        return [];
      }

      return newEvents.data;
    },
    [executeAsync]
  );

  return (
    <InfiniteScrollList<EventDetail>
      items={events}
      setItems={setEvents}
      fetchMore={fetchMoreEvents}
      renderItem={(event) => <EventCard key={event.id} event={event} />}
    />
  );
};

export const BookmarkedEventsList = ({ initialEvents }: EventsListProps) => {
  const [events, setEvents] = useState(initialEvents);

  const { executeAsync } = useAction(getBookmarkedEvent);

  const fetchMore = useCallback(
    async ({ cursor }: { cursor?: Event['id'] }) => {
      const newEvents = await executeAsync({ cursor });

      if (!newEvents?.data || newEvents.data.length === 0) {
        return [];
      }

      return newEvents.data;
    },
    [executeAsync]
  );

  return (
    <InfiniteScrollList<EventDetail>
      items={events}
      setItems={setEvents}
      fetchMore={fetchMore}
      renderItem={(event) => <EventCard key={event.id} event={event} />}
    />
  );
};
