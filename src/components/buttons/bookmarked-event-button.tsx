'use client';

import { RegisterLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import debounce from 'lodash.debounce';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import routes, { BASE_URL } from '~/config/routes';
import { toast } from '~/hooks/use-toast';
import { EventDetail } from '~/lib/prisma/validators/event-validator';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useParticipantView } from '~/hooks/use-participant-view';
import { useAction } from 'next-safe-action/hooks';
import { bookmarkEvent } from '~/lib/actions/bookmark-event.action';

interface Props {
  event: EventDetail;
}

export const BookmarkedEventButton = ({ event }: Props) => {
  const { user } = useKindeBrowserClient();

  const [isBookmarked, setIsBookmarked] = useState(false);

  const isParticipantView = useParticipantView();

  const { execute } = useAction(bookmarkEvent, {
    onError: (err) => {
      console.error(err);

      toggleClientBookmark();
    },
    onSuccess: () => console.log('Success bookmark!'),
  });

  useEffect(() => {
    setIsBookmarked(event.bookmarkedBy.some((bookmarkUser) => bookmarkUser.id === user?.id));
  }, [event.bookmarkedBy, user?.id]);

  const performBookmark = useCallback(
    debounce(
      () => {
        execute({ eventId: event.id });
      },
      1000,
      { leading: false, trailing: true }
    ),
    [event.id]
  );

  const toggleClientBookmark = () => {
    const wasBookmarked = isBookmarked;

    setIsBookmarked((prev) => !prev);

    toast({
      description: wasBookmarked ? 'Event removed from bookmarks!' : 'Event added to bookmarks!',
    });
  };

  const handleBookmark = useCallback(() => {
    performBookmark();
    toggleClientBookmark();
  }, [performBookmark, toggleClientBookmark]);

  if (isParticipantView) {
    return null;
  }

  if (!user) {
    return (
      <RegisterLink
        postLoginRedirectURL={`${BASE_URL}${routes.event({
          eventSlug: event.slug,
          ownerId: event.ownerId,
        })}`}
      >
        <Button className='rounded-full'>
          <Bookmark className='w-4 h-4' />
        </Button>
      </RegisterLink>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleBookmark} variant={isBookmarked ? 'default' : 'outline'} className='rounded-full'>
            {isBookmarked ? <BookmarkCheck className='w-4 h-4' /> : <Bookmark className='w-4 h-4' />}
          </Button>
        </TooltipTrigger>

        <TooltipContent className='bg-black text-white text-sm'>
          {isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
