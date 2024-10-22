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

type Props = {
  pollId: Poll['id'];
  onSucces?: () => void;
} & AlertDialogProps;

export const ClosePollDialog = ({ pollId, onSucces: handleSuccess, ...props }: Props) => {
  const isFieldDisabled = false;
  const isExecuting = false;
  const handleClose = async (evt: React.MouseEvent) => {};

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
