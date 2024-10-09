'use client';

import { RegisterLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Event, Question } from '@prisma/client';
import { ThumbsUp } from 'lucide-react';
import { QuestionDetail } from '~/lib/prisma/validators/question-validator';
import { cn, PropsWithClassName } from '~/lib/utils';

type Props = PropsWithClassName<{
  questionId: Question['id'];
  eventSlug: Event['slug'];
  ownerId: Event['ownerId'];
  upvotes: QuestionDetail['upvotes'];
  totalVotes: number;
  isResolved: boolean;
}>;

export const QuestionVoteButton = ({ questionId, eventSlug, ownerId, upvotes, totalVotes, isResolved, className }: Props) => {
  const { user } = useKindeBrowserClient();

  const isUpvoted = upvotes.some((upvote) => upvote.authorId === user?.id);

  if (!user) {
    return (
      <RegisterLink>
        <button className={cn('flex flex-col items-center', className)}>
          <ThumbsUp className='size-5' />
          <span className='ml-2'>{totalVotes}</span>
        </button>
      </RegisterLink>
    );
  }

  return (
    <button className={cn('flex flex-col items-center disabled:cursor-not-allowed disabled:opacity-80', className)} disabled={isResolved}>
      <ThumbsUp className={cn(isUpvoted && 'stroke-blue-500')} />
      <span className={cn('px-2 pt-1 text-sm', isUpvoted && 'text-blue-500')}>{totalVotes}</span>
    </button>
  );
};
