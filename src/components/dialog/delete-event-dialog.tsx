import { Event } from '@prisma/client';
import { AlertDialogProps } from '@radix-ui/react-alert-dialog';
import { useAction } from 'next-safe-action/hooks';
import { MouseEvent, useCallback } from 'react';
import { toast } from '~/hooks/use-toast';
import { deleteEvent } from '~/lib/actions/delete-event.action';
import { cn } from '~/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { buttonVariants } from '../ui/button';

type Props = {
  eventId: Event['id'];
  onSuccess?: () => void;
} & AlertDialogProps;

export const DeleteEventDialog = ({ eventId, onSuccess: handleSuccess, ...dialogProps }: Props) => {
  const { execute, isExecuting } = useAction(deleteEvent, {
    onSuccess: () => {
      handleSuccess?.();
      toast({
        title: 'Event deleted',
        description: 'The event has been successfully deleted',
        duration: 5000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.error.serverError,
        variant: 'destructive',
      });
    },
  });

  const handleDelete = useCallback(
    (evt: MouseEvent) => {
      evt.preventDefault();
      execute({ eventId });
    },
    [eventId, execute]
  );

  const isDisabled = isExecuting;

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete event</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to delete this event?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={cn(buttonVariants({ variant: 'ghost' }))}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isDisabled} onClick={handleDelete} className={cn(buttonVariants({ variant: 'destructive' }))}>
            {isDisabled ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
