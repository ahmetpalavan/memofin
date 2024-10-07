import React from 'react';
import { BookmarkedEventsList } from '~/components/events-list';
import { NoContent } from '~/components/illustrations';
import { ScrollArea } from '~/components/ui/scroll-area';
import { getUserBookmarkedEvents } from '~/lib/server/get-user-bookmarked-events';

const Bookmarks = async () => {
  const initialBookmarks = await getUserBookmarkedEvents();
  return (
    <ScrollArea className='w-full h-full px-4 py-2'>
      <h2 className='text-2xl font-bold mb-8 mt-4 ml-4'>Bookmarked Events</h2>

      <div className='relative h-full grid gap-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
        {initialBookmarks.length === 0 ? (
          <NoContent className='w-full h-full'>
            <p className='text-lg text-gray-500'>You haven't bookmarked any events yet.</p>
          </NoContent>
        ) : (
          <BookmarkedEventsList initialEvents={initialBookmarks} />
        )}
      </div>
    </ScrollArea>
  );
};

export default Bookmarks;
