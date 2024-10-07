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

interface Props {
  event: EventDetail;
}

export const BookmarkedEventButton = ({ event }: Props) => {
  const { user } = useKindeBrowserClient();

  const [isBookmarked, setIsBookmarked] = useState(false);

  const isParticipantView = false;

  if (isParticipantView) {
    return null;
  }

  useEffect(() => {
    setIsBookmarked(event.bookmarkedBy.some((bookmarkUser) => bookmarkUser.id === user?.id));
  }, [event.bookmarkedBy, user?.id]);

  const handleBookmark = useCallback(() => {
    performBookmark();
    toggleClientBookmark();
  }, []);

  const performBookmark = useCallback(() => {
    debounce(
      () => {
        console.log('debounce');
      },
      1000,
      {
        leading: true,
        trailing: true,
      }
    );
  }, [event.id]);

  const toggleClientBookmark = () => {
    const wasBookmarked = isBookmarked;

    setIsBookmarked((prev) => !prev);

    toast({
      description: wasBookmarked ? 'Event removed from bookmarks!' : 'Event added to bookmarks!',
    });
  };

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
