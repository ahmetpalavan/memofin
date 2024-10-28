import { Poll } from '@prisma/client';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogProps,
  AlertDialogTitle,
} from '@radix-ui/react-alert-dialog';
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from '../ui/alert-dialog';
import { cn } from '~/lib/utils';
import { buttonVariants } from '../ui/button';
import { useAction } from 'next-safe-action/hooks';
import { deletePoll } from '~/lib/actions/delete-poll.action';
import { toast } from '~/hooks/use-toast';

type Props = {
  pollId: Poll['id'];
  onSucces?: () => void;
} & AlertDialogProps;

export const DeletePollDialog = ({ pollId, onSucces: handleSuccess, ...props }: Props) => {
  const { execute, isExecuting } = useAction(deletePoll, {
    onError: (err) => {
      toast({
        title: 'Error',
        description: err.error.serverError,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Poll deleted',
        duration: 5000,
        description: 'Your poll has been deleted successfully.',
      });
      handleSuccess?.();
    },
  });
  const isFieldDisabled = isExecuting;
  const handleDelete = (evt: React.MouseEvent) => {
    evt.preventDefault();
    execute({ pollId });
  };

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-destructive'>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your poll from the event.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isFieldDisabled} className={cn(buttonVariants({ variant: 'ghost' }))}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction disabled={isFieldDisabled} onClick={handleDelete} className={cn(buttonVariants({ variant: 'destructive' }))}>
            {isExecuting ? 'Deleting...' : 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
