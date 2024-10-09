'use client';

import { Event } from '@prisma/client';
import copy from 'copy-to-clipboard';
import { Copy } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from '~/hooks/use-toast';
import { getEventLink } from '~/utils/event-utils';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

type Props = {
  ownerId: Event['ownerId'];
  eventSlug: Event['slug'];
};

export const CopyEventLinkButton = ({ eventSlug, ownerId }: Props) => {
  const handleCopy = useCallback(() => {
    copy(getEventLink({ eventSlug, ownerId }));
    toast({
      description: 'Event link copied to clipboard',
      variant: 'default',
    });
  }, [eventSlug, ownerId]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleCopy} variant={'outline'} className='rounded-full'>
            <Copy className='w-4 h-4' />
          </Button>
        </TooltipTrigger>

        <TooltipContent className='bg-black text-white text-sm'>Copy link to clipboard</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
