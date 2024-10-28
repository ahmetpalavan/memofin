'use client';

import { ReactNode, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';
import { CreateEventForm } from '../form/create-event-form';

type Props = { children: ReactNode };

export const NewEventDialog = ({ children }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Create a new poll</DialogTitle>
        <CreateEventForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
