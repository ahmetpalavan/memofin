'use client';

import { Event } from '@prisma/client';
import { ReactNode, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';
import { CreatePollForm } from '../form/create-poll-form';

type Props = {
  children: ReactNode;
  eventId: Event['id'];
};

export const NewPollDialog = ({ children, eventId }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Create a new poll</DialogTitle>
        <CreatePollForm eventId={eventId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
