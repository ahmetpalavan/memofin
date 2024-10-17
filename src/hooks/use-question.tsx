import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Question } from '@prisma/client';
import debounce from 'lodash.debounce';
import { useAction } from 'next-safe-action/hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { updateQuestionAction } from '~/lib/actions/update-question.action';
import { QuestionDetail } from '~/lib/prisma/validators/question-validator';
import { toast } from './use-toast';
import { voteQuestionAction } from '~/lib/actions/vote-question.action';

type Props = {
  isPinned: boolean;
  questionId: Question['id'];
};

export const useQuestionPinned = ({ isPinned: initialPinned, questionId }: Props) => {
  const [isPinned, setIsPinned] = useState<boolean>(initialPinned);

  const { execute, isExecuting } = useAction(updateQuestionAction, {
    onSuccess: () => {
      console.log('Success');
      toast({
        title: 'Success',
        description: 'Question pinned',
      });
    },
    onError: () => {
      console.log('Error');
      toast({
        title: "Couldn't vote",
        variant: 'destructive',
        description: 'Please try again later',
      });

      setIsPinned((prev) => !prev);
    },
  });

  const togglePin = useCallback(() => {
    setIsPinned((prev) => !prev);

    execute({
      questionId,
      isPinned: !isPinned,
    });
  }, []);

  return { isPinned, togglePin, isExecuting };
};

export const useToggleResolved = ({ questionId, isResolved: initialIsResolved }: { questionId: Question['id']; isResolved: boolean }) => {
  const [isResolved, setIsResolved] = useState(initialIsResolved);

  const { execute, isExecuting } = useAction(updateQuestionAction, {
    onSuccess: () => {
      console.log('Success resolved');
      toast({
        title: 'Success',
        description: 'Question resolved',
      });
    },
    onError: () => {
      console.log('Error');
      toast({
        title: "Couldn't vote",
        variant: 'destructive',
        description: 'Please try again later',
      });

      setIsResolved((prev) => !prev);
    },
  });

  const toggleResolved = useCallback(() => {
    setIsResolved((prev) => !prev);

    execute({
      questionId,
      isResolved: !isResolved,
    });
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

  const { execute } = useAction(voteQuestionAction, {
    onError: (error) => {
      console.error(error);

      toggleClientVote();
    },
    onSuccess: () => console.log('success voting!'),
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
    toggleClientVote();
    performVote();
  }, [toggleClientVote]);

  const performVote = useCallback(
    debounce(
      () => {
        execute({ questionId });
      },
      1000,
      { leading: false, trailing: true }
    ),
    [questionId]
  );

  return { isUpvoted, totalVotes, handleVote, toggleClientVote };
};

export const useUpdateQuestion = ({ body, questionId }: { questionId: Question['id']; body: Question['body'] }) => {
  const lastValidBody = useRef(body);
  const [newBody, setNewBody] = useState(body);

  const { execute, isExecuting } = useAction(updateQuestionAction, {
    onSuccess: ({ input }) => {
      console.log('Success');

      lastValidBody.current = input.body!;
      toast({
        title: 'Success',
        description: 'Question updated',
      });
    },

    onError: (error) => {
      console.log('Error');
      toast({
        title: "Couldn't update question",
        variant: 'destructive',
        description: 'Please try again later',
      });

      setNewBody(lastValidBody.current);
    },
  });

  const updateBody = useCallback((newBody: string) => {
    setNewBody(newBody);

    execute({
      questionId,
      body: newBody,
    });
  }, []);

  return { newBody, updateBody, isExecuting };
};
