'use client';

import { Edit, Settings, Trash } from 'lucide-react';
import { cn } from '~/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { EventDetail } from '~/lib/prisma/validators/event-validator';
import { PropsWithClassName } from '~/lib/utils';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useState } from 'react';
import { Button } from '../ui/button';
import { DeleteEventDialog } from '../dialog/delete-event-dialog';
import { useParticipantView } from '~/hooks/use-participant-view';

type Props = PropsWithClassName<{
  event: EventDetail;
}>;

export const EventAdminMenu = ({ event, className }: Props) => {
  const { user } = useKindeBrowserClient();

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const isParticipantView = useParticipantView();
  const isAdmin = event.ownerId === user?.id;

  if (isParticipantView || !isAdmin) {
    return null;
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button className='rounded-full text-black' variant={'outline'}>
            <Settings className={cn('w-4 h-4', className)} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='p-2 space-y-1'>
          <DropdownMenuItem className='text-sm' onSelect={() => setOpenUpdateDialog(true)}>
            <Edit className='w-4 h-4 mr-2' />
            <span>Edit event</span>
          </DropdownMenuItem>

          <DropdownMenuItem className='text-sm text-destructive' onSelect={() => setOpenDeleteDialog(true)}>
            <Trash className='w-4 h-4 mr-2' />
            <span>Delete event</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteEventDialog eventId={event.id} open={openDeleteDialog} onOpenChange={setOpenDeleteDialog} />
    </>
  );
};
