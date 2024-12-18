import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { NewEventDialog } from '~/components/dialog/new-event-dialog';
import { EventsList } from '~/components/events-list';
import { ScrollArea } from '~/components/ui/scroll-area';
import { getUserEvents } from '~/lib/server/get-user-events';

const MyEventsPage = async () => {
  const queryClient = new QueryClient();

  const initialEvents = await queryClient.fetchQuery({
    queryKey: ['user-events'],
    queryFn: () => getUserEvents(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ScrollArea className='w-full h-full px-4 py-2'>
        <h2 className='text-2xl font-bold mb-8 mt-4 ml-4'>Account</h2>
        <div className='grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3'>
          <NewEventDialog>
            <button className='h-24 md:h-36 bg-white/50 border-[3px] border-spacing-4 border-dashed rounded-lg grid place-items-center group'>
              <span className='inline-flex flex-col items-center gap-x-1 font-medium group-hover:text-blue-600 transition-colors duration-150'>
                <Plus className='w-5 h-5' />
                <span>New Event</span>
              </span>
            </button>
          </NewEventDialog>
          <EventsList initialEvents={initialEvents} />
        </div>
      </ScrollArea>
    </HydrationBoundary>
  );
};

export default MyEventsPage;
