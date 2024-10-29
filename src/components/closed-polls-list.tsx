'use client';

import { Event, Poll, User } from '@prisma/client';
import { CircleCheckBig } from 'lucide-react';
import { useCallback, useState } from 'react';
import { PollDetails } from '~/lib/prisma/validators/poll-validator';
import { cn, PropsWithClassName } from '~/lib/utils';
import { NoContent } from './illustrations';
import { ClosedPoll } from './live-poll';
import { useAction } from 'next-safe-action/hooks';
import { getEventClosedPollsAction } from '~/lib/actions/get-event-closed-polls.action';
import { useSearchParams } from 'next/navigation';
import { InfiniteScrollList } from './infinite-scroll-list';

type Props = PropsWithClassName<{
  initialPolls: PollDetails[];
  ownerId: User['id'];
  eventSlug: Event['slug'];
  pollId?: Poll['id'];
}>;

export const ClosedPollsList = ({ initialPolls, ownerId, eventSlug, pollId, className }: Props) => {
  const [closedPolls, setClosedPolls] = useState(initialPolls);

  const { executeAsync } = useAction(getEventClosedPollsAction);

  const searchParams = useSearchParams();

  const fetchMoreClosedPolls = useCallback(
    async ({ cursor }: { cursor?: Poll['id'] }) => {
      const newQuestion = await executeAsync({
        eventSlug,
        ownerId,
        cursor,
        pollId,
      });

      if (!newQuestion?.data || newQuestion.data.length === 0) {
        return [];
      }

      return newQuestion.data;
    },
    [eventSlug, ownerId, pollId, executeAsync]
  );

  return (
    <div className={cn('grid grid-cols-1 gap-4', className)}>
      {closedPolls.length === 0 ? (
        <NoContent className='tracking-tight font-light mt-4'>
          <CircleCheckBig size={64} />
          <h2 className='text-lg font-bold'>No closed polls</h2>
          <p>There are no closed polls in this event.</p>
        </NoContent>
      ) : (
        <InfiniteScrollList<PollDetails>
          key={`closed-polls-${searchParams.toString()}`}
          fetchMore={fetchMoreClosedPolls}
          items={closedPolls}
          setItems={setClosedPolls}
          renderItem={(poll) => <ClosedPoll key={poll.id} poll={poll} />}
        />
      )}
    </div>
  );
};
