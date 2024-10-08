'use client';

import { CircleCheckBig, Edit, EllipsisVertical, Pin, Trash } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useParticipantView } from '~/hooks/use-participant-view';
import { QuestionDetail } from '~/lib/prisma/validators/question-validator';
import { PropsWithClassName } from '~/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useConfirm } from '~/hooks/use-confirm';

type Props = PropsWithClassName<{
  questionId: QuestionDetail['id'];
  isPinned: boolean;
  isResolved: boolean;
  isAuthor: boolean;
  isAdmin: boolean;
  isEditing: boolean;
  toggleEditing: () => void;
  onPinChange: (isPinned: boolean) => void;
  onResolveChange: (isResolved: boolean) => void;
}>;

const iconClasses = 'w-4 h-4 mr-2';

export const QuestionOptionsMenu = ({
  isPinned,
  isResolved,
  isAuthor,
  isAdmin,
  isEditing,
  toggleEditing,
  onPinChange,
  onResolveChange,
  className,
}: Props) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const isParticipantView = useParticipantView();

  const [ConfirmDialog, onConfirm] = useConfirm('Confirm Delete', 'Are you sure you want to delete this question?');

  const handleDelete = useCallback(async () => {
    const ok = await onConfirm();

    if (!ok) return;

    setOpenDeleteDialog(true);
  }, []);

  const canEdit = isAuthor && !isEditing;
  const canPin = isAdmin;
  const canDelete = isAdmin || isAuthor;
  const canResolve = isAdmin;

  const permissions = [canEdit, canPin, canDelete, canResolve];

  if (isParticipantView || !permissions.some((permission) => !permission)) {
    return null;
  }

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className={className}>
            <EllipsisVertical className='inline-block size-5 fill-muted-foreground' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='p-2 space-y-1'>
          {canResolve && (
            <DropdownMenuItem
              onSelect={() => {
                onResolveChange(!isResolved);
              }}
              className='text-sm'
            >
              <CircleCheckBig className={iconClasses} />
              <span>Mark as {isResolved ? 'unresolved' : 'resolved'}</span>
            </DropdownMenuItem>
          )}

          {canPin && (
            <DropdownMenuItem
              onSelect={() => {
                onPinChange(!isPinned);
              }}
              className='text-sm'
            >
              <Pin className={iconClasses} />
              <span>{isPinned ? 'Unpin' : 'Pin'} question</span>
            </DropdownMenuItem>
          )}

          {canEdit && (
            <DropdownMenuItem onSelect={toggleEditing} className='text-sm'>
              <Edit className={iconClasses} />
              <span>Edit question</span>
            </DropdownMenuItem>
          )}

          {canDelete && (
            <DropdownMenuItem className='text-sm text-destructive' onSelect={handleDelete}>
              <Trash className={iconClasses} />
              <span>Delete question</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
