import { Question } from '@prisma/client';
import { AlertDialogProps } from '@radix-ui/react-alert-dialog';
import { useAction } from 'next-safe-action/hooks';
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
import { deleteQuestionAction } from '~/lib/actions/delete-question.action';
import { toast } from '~/hooks/use-toast';
import { cn } from '~/lib/utils';

type Props = {
  questionId: Question['id'];
  onSuccess?: () => void;
} & AlertDialogProps;

export const DeleteQuestionDialog = ({ questionId, onSuccess: handleSuccess, ...dialogProps }: Props) => {
  const { execute, isExecuting } = useAction(deleteQuestionAction, {
    onError: (err) => {
      console.error(err);

      toast({
        title: 'Something went wrong',
        description: 'Failed to delete the question.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      handleSuccess?.();

      toast({ title: 'Your questions has been deleted!' });
    },
  });

  const handleDelete = async (evt: React.MouseEvent) => {
    evt.preventDefault();

    execute({ questionId });
  };

  const isFieldDisabled = isExecuting;

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your question from the event.
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
