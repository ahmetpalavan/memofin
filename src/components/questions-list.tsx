'use client';

import { Event, User } from '@prisma/client';
import { useAction } from 'next-safe-action/hooks';
import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { getEventOpenQuestionsAction } from '~/lib/actions/get-event-open-question.action';
import { QuestionDetail } from '~/lib/prisma/validators/question-validator';
import { cn, PropsWithClassName } from '~/lib/utils';
import { QuestionsOrderBy } from '~/utils/question-utils';
import { CreateQuestionForm } from './form/create-question-form';
import { NoContent } from './illustrations';
import { InfiniteScrollList } from './infinite-scroll-list';
import { Question } from './question';
import { getEventResolvedQuestions } from '~/lib/server/get-event-resolved-questions';
import { getEventResolvedQuestionsAction } from '~/lib/actions/get-event-resolved-question.action';

type Props = PropsWithClassName<{
  initialQuestions: QuestionDetail[];
  ownerId: User['id'];
  eventSlug: Event['slug'];
  orderBy: QuestionsOrderBy;
  questionId?: QuestionDetail['id'];
}>;

export const OpenQuestions = ({ initialQuestions, ownerId, eventSlug, orderBy, questionId, className }: Props) => {
  const [questions, setQuestions] = useState<QuestionDetail[]>(initialQuestions);
  const searchParams = useSearchParams();

  const hasFilters = !!questionId;

  const { executeAsync } = useAction(getEventOpenQuestionsAction);

  const fetchMoreOpenQuestions = useCallback(
    async ({ cursor }: { cursor?: QuestionDetail['id'] }) => {
      const newQuestions = await executeAsync({
        cursor,
        eventSlug,
        ownerId,
        orderBy,
        questionId,
      });

      if (!newQuestions?.data || newQuestions.data.length === 0) {
        return [];
      }

      return newQuestions.data;
    },
    [executeAsync, eventSlug, orderBy, ownerId, questionId]
  );

  return (
    <div className={cn('space-y-8 pb-10', className)}>
      {!hasFilters && (
        <CreateQuestionForm
          eventSlug={eventSlug}
          onSuccess={(data) => setQuestions([data, ...questions])}
          ownerId={ownerId}
          key={Date.now()}
        />
      )}
      {questions.length === 0 ? (
        <NoContent>
          <span className='tracking-tight font-light mt-3'>No questions has been asked yet.</span>
        </NoContent>
      ) : (
        <InfiniteScrollList<QuestionDetail>
          key={`open-${searchParams.toString()}`}
          items={questions}
          setItems={setQuestions}
          renderItem={(question) => <Question key={question.id} question={question} />}
          fetchMore={fetchMoreOpenQuestions}
        />
      )}
    </div>
  );
};

export const ResolvedQuestions = ({ initialQuestions, ownerId, eventSlug, orderBy, questionId, className }: Props) => {
  const [questions, setQuestions] = useState<QuestionDetail[]>(initialQuestions);

  const searchParams = useSearchParams();

  const { executeAsync } = useAction(getEventResolvedQuestionsAction);

  const fetchMoreResolvedQuestions = useCallback(
    async ({ cursor }: { cursor?: QuestionDetail['id'] }) => {
      const newQuestions = await executeAsync({
        cursor,
        eventSlug,
        ownerId,
        orderBy,
        questionId,
      });

      if (!newQuestions?.data || newQuestions.data.length === 0) {
        return [];
      }

      return newQuestions.data;
    },
    [executeAsync, eventSlug, orderBy, ownerId, questionId]
  );

  return (
    <div className={cn('space-y-8 pb-10', className)}>
      {initialQuestions.length === 0 ? (
        <NoContent>
          <span className={cn('text-center text-lg font-medium text-muted-foreground', 'mt-0')}>No resolved questions found.</span>
        </NoContent>
      ) : (
        <InfiniteScrollList<QuestionDetail>
          key={`resolved-${searchParams.toString()}`}
          items={questions}
          setItems={setQuestions}
          renderItem={(question) => <Question key={question.id} question={question} />}
          fetchMore={fetchMoreResolvedQuestions}
        />
      )}
    </div>
  );
};
