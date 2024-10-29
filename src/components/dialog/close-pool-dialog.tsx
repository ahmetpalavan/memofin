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
import { closePollAction } from '~/lib/actions/close-poll.action';
import { toast } from '~/hooks/use-toast';

type Props = {
  pollId: Poll['id'];
  onSucces?: () => void;
} & AlertDialogProps;

export const ClosePollDialog = ({ pollId, onSucces: handleSuccess, ...props }: Props) => {
  const { execute, isExecuting } = useAction(closePollAction, {
    onError: (err) => {
      toast({
        title: 'Failed to close poll',
        description: `Failed to close poll. ${err.error.serverError}`,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      handleSuccess?.();
      toast({
        title: 'Poll closed',
        description: 'Poll closed successfully',
        variant: 'default',
      });
    },
  });

  const isFieldDisabled = isExecuting;
  const handleClose = (evt: React.MouseEvent) => {
    evt.preventDefault();
    execute({ pollId });
  };

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-destructive'>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The poll will be closed and the results will be displayed to the participants.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isFieldDisabled} className={cn(buttonVariants({ variant: 'ghost' }))}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction disabled={isFieldDisabled} onClick={handleClose} className={cn(buttonVariants({ variant: 'destructive' }))}>
            {isExecuting ? 'Closing...' : 'Close'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
