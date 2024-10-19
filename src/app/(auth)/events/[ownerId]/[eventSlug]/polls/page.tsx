import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Plus } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ClearSearchButton, RefreshButton } from '~/components/buttons';
import { PollsTabNavigation } from '~/components/layout/polls-tab-navigation';
import { Loader } from '~/components/loader';
import { Button } from '~/components/ui/button';
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
            <Button variant='ghost' className='bg-primary hover:bg-primary/50 space-x-1'>
              <Plus size={16} />
              <span>New</span>
              <span className='lg:inline hidden'>Poll</span>
            </Button>
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
  const showPolls = getEventLivePolls({ ownerId, eventSlug });

  return (
    <div>
      {/* {showPolls ? (
        <div>
          <p>Live Polls</p>
        </div>
      ) : (
        <div>
          <p>No live polls</p>
        </div>
      )} */}
    </div>
  );
};

export default EventPolls;
