import { EventDetail } from '~/lib/prisma/validators/event-validator';
import { EventCard } from './event-card';

interface EventsListProps {
  initialEvents: EventDetail[];
}

export const EventsList = ({ initialEvents }: EventsListProps) => {
  return initialEvents.map((event) => <EventCard className='h-36' key={event.id} event={event} />);
};

export const BookmarkedEventsList = ({ initialEvents }: EventsListProps) => {
  return initialEvents.map((event) => <EventCard className='h-36' key={event.id} event={event} />);
};
