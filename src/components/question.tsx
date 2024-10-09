'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { CheckCircle, EllipsisVertical, Pin } from 'lucide-react';
import { useState } from 'react';
import { QuestionDetail } from '~/lib/prisma/validators/question-validator';
import { cn } from '~/lib/utils';
import { defaultDateFormatter } from '~/utils/date-utils';
import { UserAvatar } from './user-avatar';
import { QuestionVoteButton } from './buttons/question-vote-button';
import { QuestionOptionsMenu } from './menu';

type Props = {
  question: QuestionDetail;
};

export const Question = ({ question }: Props) => {
  const { user } = useKindeBrowserClient();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { author, createdAt } = question;
  const isAuthor = user?.id === author.id;
  const isAdmin = question.event.ownerId === user?.id;

  const { body, isPinned, isResolved } = question;

  return (
    <div className={cn('border rounded-xl drop-shadow-md bg-white p-4 lg:p-6', isResolved && 'border-primary bg-primary/10')}>
      <div className='flex items-center gap-x-4'>
        {!isEditing && (
          <QuestionVoteButton
            ownerId={question.event.ownerId}
            eventSlug={question.event.slug}
            upvotes={question.upvotes}
            questionId={question.id}
            totalVotes={question._count.upvotes}
            isResolved={isResolved}
          />
        )}
        <div className='flex-1 grow-1'>
          <div className='flex items-center gap-x-2'>
            <span className='inline-flex items-center gap-x-2'>
              <UserAvatar color={author.color} displayName={author.name} className='w-5 h-5' />
              <div className='text-sm text-muted-foreground'>{author.name}</div>
            </span>
            <time className='text-xs text-muted-foreground'>{defaultDateFormatter.format(new Date(createdAt))}</time>
            {isPinned && <Pin className='inline-block size-5 fill-primary -rotate-45' />}
            {isResolved && <CheckCircle className='inline-block size-5 fill-primary' />}
            {!isResolved && (
              <QuestionOptionsMenu
                questionId={question.id}
                isPinned={isPinned}
                isResolved={isResolved}
                isAuthor={isAuthor}
                isAdmin={isAdmin}
                isEditing={isEditing}
                toggleEditing={() => setIsEditing((prev) => !prev)}
                onPinChange={() => {}}
                onResolveChange={() => {}}
                className={cn('ml-auto text-muted-foreground', isAuthor && 'hover:bg-primary/10')}
              />
            )}
          </div>
          {!isEditing && <div className='mt-5 ml-3 whitespace-pre-wrap text-sm'>{body}</div>}
          {isEditing && (
            <form className='mt-5'>
              <textarea className='w-full h-20 p-2 border rounded-lg' defaultValue={body} />
              <div className='flex justify-end mt-2'>
                <button type='submit' className='btn-primary'>
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
