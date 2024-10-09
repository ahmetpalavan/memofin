'use client';

import { RegisterLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Event, Question } from '@prisma/client';
import { ThumbsUp } from 'lucide-react';
import { useVote } from '~/hooks/use-question';
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

export const QuestionVoteButton = ({
  questionId,
  eventSlug,
  ownerId,
  upvotes,
  totalVotes: initialTotalVotes,
  isResolved,
  className,
}: Props) => {
  const { user } = useKindeBrowserClient();

  const { isUpvoted, handleVote, totalVotes } = useVote({
    questionId,
    totalVotes: initialTotalVotes,
    upvotes,
  });

  if (!user) {
    return (
      <RegisterLink>
        <button className={cn('flex flex-col items-center', className)}>
          <ThumbsUp size={24} />
          <span className='px-2 pt-1 text-sm'>{totalVotes}</span>
        </button>
      </RegisterLink>
    );
  }

  return (
    <button
      onClick={handleVote}
      className={cn('flex flex-col items-center disabled:cursor-not-allowed disabled:opacity-80', className)}
      disabled={isResolved}
    >
      <ThumbsUp className={cn(isUpvoted && 'stroke-blue-500')} />
      <span className={cn('px-2 pt-1 text-sm', isUpvoted && 'text-blue-500')}>{totalVotes}</span>
    </button>
  );
};
