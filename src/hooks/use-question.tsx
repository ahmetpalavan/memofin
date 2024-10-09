import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Question } from '@prisma/client';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import { QuestionDetail } from '~/lib/prisma/validators/question-validator';

type Props = {
  isPinned: boolean;
  questionId: Question['id'];
};

export const useQuestionPinned = ({ isPinned: initialPinned, questionId }: Props) => {
  const [isPinned, setIsPinned] = useState<boolean>(initialPinned);

  const togglePin = useCallback(() => {
    setIsPinned((prev) => !prev);
  }, []);

  return { isPinned, togglePin };
};

export const useToggleResolved = ({ questionId, isResolved: initialIsResolved }: { questionId: Question['id']; isResolved: boolean }) => {
  const [isResolved, setIsResolved] = useState(initialIsResolved);

  const toggleResolved = useCallback(() => {
    setIsResolved((prev) => !prev);
  }, []);

  return { isResolved, toggleResolved };
};

type VoteProps = {
  questionId: Question['id'];
  upvotes: QuestionDetail['upvotes'];
  totalVotes: number;
};

export const useVote = ({ questionId, totalVotes: initialVotes, upvotes }: VoteProps) => {
  const { user } = useKindeBrowserClient();

  const [{ isUpvoted, totalVotes }, setClientState] = useState({
    isUpvoted: upvotes.some((u) => u.authorId === user?.id),
    totalVotes: initialVotes,
  });

  useEffect(() => {
    setClientState({
      isUpvoted: upvotes.some((u) => u.authorId === user?.id),
      totalVotes: initialVotes,
    });
  }, [upvotes, user]);

  const toggleClientVote = useCallback(() => {
    setClientState(({ isUpvoted, totalVotes }) => ({
      isUpvoted: !isUpvoted,
      totalVotes: isUpvoted ? totalVotes - 1 : totalVotes + 1,
    }));
  }, []);

  const handleVote = useCallback(() => {
    performVote();

    toggleClientVote();
  }, [toggleClientVote]);

  const performVote = useCallback(() => {
    debounce(
      async () => {
        console.log('Voting...');
      },
      1000,
      {
        leading: false,
        trailing: true,
      }
    );
  }, [questionId]);

  return { isUpvoted, totalVotes, handleVote, toggleClientVote };
};

export const useUpdateQuestion = ({ body, questionId }: { questionId: Question['id']; body: Question['body'] }) => {
  const [newBody, setNewBody] = useState(body);

  const updateBody = useCallback((newBody: string) => {
    setNewBody(newBody);
  }, []);

  return { newBody, updateBody };
};
