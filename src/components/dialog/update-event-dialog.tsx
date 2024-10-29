'use client';

import { DialogProps } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { EventDetail } from '~/lib/prisma/validators/event-validator';
import { UpdateEventForm } from '../form/update-event-form';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';

type Props = {
  event: EventDetail;
  onSuccess?: () => void;
} & DialogProps;

export const UpdateEventDialog = ({ event, onSuccess: handleSuccess, ...props }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <DialogContent>
        <DialogTitle>Update Event</DialogTitle>
        <UpdateEventForm event={event} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};
