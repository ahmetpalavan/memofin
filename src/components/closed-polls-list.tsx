'use client';

import { Event, Poll, User } from '@prisma/client';
import { CircleCheckBig } from 'lucide-react';
import { useState } from 'react';
import { PollDetails } from '~/lib/prisma/validators/poll-validator';
import { cn, PropsWithClassName } from '~/lib/utils';
import { NoContent } from './illustrations';
import { ClosedPoll } from './live-poll';

type Props = PropsWithClassName<{
  initialPolls: PollDetails[];
  ownerId: User['id'];
  eventSlug: Event['slug'];
  pollId?: Poll['id'];
}>;

export const ClosedPollsList = ({ initialPolls, ownerId, eventSlug, pollId, className }: Props) => {
  const [closedPolls, setClosedPolls] = useState(initialPolls);
  return (
    <div className={cn('grid grid-cols-1 gap-4', className)}>
      {closedPolls.length === 0 ? (
        <NoContent className='tracking-tight font-light mt-4'>
          <CircleCheckBig size={64} />
          <h2 className='text-lg font-bold'>No closed polls</h2>
          <p>There are no closed polls in this event.</p>
        </NoContent>
      ) : (
        closedPolls.map((poll) => <ClosedPoll key={poll.id} poll={poll} />)
      )}
    </div>
  );
};
