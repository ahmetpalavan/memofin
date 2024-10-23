'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useState } from 'react';
import { useParticipantView } from '~/hooks/use-participant-view';
import { PollDetails } from '~/lib/prisma/validators/poll-validator';
import { PropsWithClassName } from '~/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { EllipsisVertical, Trash } from 'lucide-react';
import { DeletePollDialog } from '../dialog/delete-poll-dialog';

type Props = PropsWithClassName<{
  poll: PollDetails;
}>;

export const PollOptionMenu = ({ poll, className }: Props) => {
  const { user } = useKindeBrowserClient();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const isAdmin = user?.id === poll.event.ownerId;
  const isParticipantView = useParticipantView();

  if (!isAdmin || isParticipantView) {
    return null;
  }

  return (
    <>
      <DropdownMenu modal>
        <DropdownMenuTrigger asChild>
          <button className={className}>
            <EllipsisVertical className='w-4 h-4' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='p-2 space-y-4'>
          <DropdownMenuItem className='text-destructive' onClick={() => setOpenDeleteDialog(true)}>
            <Trash className='w-4 h-4 mr-1' />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePollDialog
        pollId={poll.id}
        onSucces={() => setOpenDeleteDialog(false)}
        onOpenChange={setOpenDeleteDialog}
        open={openDeleteDialog}
      />
    </>
  );
};
