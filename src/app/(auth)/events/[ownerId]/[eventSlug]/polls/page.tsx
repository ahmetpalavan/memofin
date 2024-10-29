import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Plus } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ClearSearchButton, RefreshButton } from '~/components/buttons';
import { ClosedPollsList } from '~/components/closed-polls-list';
import { NewPollDialog } from '~/components/dialog/new-poll-dialog';
import { NoContent } from '~/components/illustrations';
import { PollsTabNavigation } from '~/components/layout/polls-tab-navigation';
import { LivePoll } from '~/components/live-poll';
import { Loader } from '~/components/loader';
import { Button } from '~/components/ui/button';
import { getEventClosedPolls } from '~/lib/server/get-event-closed-polls';
import { getEventDetail } from '~/lib/server/get-event-detail';
import { getEventLivePolls } from '~/lib/server/get-event-live-polls';

type Params = {
  ownerId: string;
  eventSlug: string;
};

type SeacrhParams = {
  closed: string;
  asParticipant: string;
  pollId: string;
};

const EventPolls = async ({ params: { ownerId, eventSlug }, searchParams }: { params: Params; searchParams?: SeacrhParams }) => {
  const showClosed = searchParams?.closed === 'true';
  const isParticipantView = searchParams?.asParticipant === 'true';
  const pollId = searchParams?.pollId;

  const event = await getEventDetail({ eventSlug, ownerId });

  if (!event) {
    return notFound();
  }

  const user = await getKindeServerSession().getUser();
  const isAdmin = user?.id === event.owner.id;

  const showNewPollButton = isAdmin && !isParticipantView && !showClosed;

  const hasFilters = !!pollId;

  return (
    <>
      <div className='flex justify-between p-0.5'>
        <PollsTabNavigation eventSlug={eventSlug} ownerId={ownerId} />
        <div className='inline-flex items-baseline gap-x-3'>
          <RefreshButton />

          {showNewPollButton && (
            <NewPollDialog eventId={event.id}>
              <Button variant='ghost' className='bg-primary hover:bg-primary/50 space-x-1'>
                <Plus size={16} />
                <span>New</span>
                <span className='lg:inline hidden'>Poll</span>
              </Button>
            </NewPollDialog>
          )}
        </div>
      </div>

      {hasFilters && (
        <div className='p-4 bg-primary/10 text-primary rounded-lg mt-4'>
          <div className='text-sm'>You have active filters:</div>
          <ClearSearchButton />
        </div>
      )}
      <Suspense key={Date.now()} fallback={<Loader />}>
        <Polls ownerId={ownerId} eventSlug={eventSlug} showClosed={showClosed} pollId={pollId} />
      </Suspense>
    </>
  );
};

type PollsProps = {
  ownerId: string;
  eventSlug: string;
  showClosed?: boolean;
  pollId?: string;
};

const Polls = async ({ ownerId, eventSlug, showClosed, pollId }: PollsProps) => {
  const showPolls = showClosed ? getEventClosedPolls : getEventLivePolls;

  const polls = await showPolls({
    eventSlug,
    ownerId,
    ...(pollId ? { filters: { pollId } } : {}),
  });

  if (showClosed) {
    return <ClosedPollsList initialPolls={polls} ownerId={ownerId} eventSlug={eventSlug} pollId={pollId} className='mt-5' />;
  }

  if (polls.length === 0) {
    return (
      <NoContent className='mt-10'>
        <div className='text-center'>
          <h2>No polls found</h2>
          <p>There are no polls available for this event.</p>
        </div>
      </NoContent>
    );
  }

  return (
    <div className='mt-8 space-y-10'>
      {polls.map((poll) => (
        <LivePoll key={poll.id} poll={poll} />
      ))}
    </div>
  );
};

export default EventPolls;
