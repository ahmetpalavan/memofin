import { Suspense } from 'react';
import { ClearSearchButton, RefreshButton } from '~/components/buttons';
import { QuestionsTabsNavigation } from '~/components/layout';
import { Loader } from '~/components/loader';
import { OpenQuestions, ResolvedQuestions } from '~/components/questions-list';
import { QuestionsSortBySelect } from '~/components/selects';
import { getEventOpenQuestions } from '~/lib/server/get-event-open-questions';
import { getEventResolvedQuestions } from '~/lib/server/get-event-resolved-questions';
import { QuestionsOrderBy } from '~/utils/question-utils';

interface TypeParams {
  ownerId: string;
  eventSlug: string;
}

interface SearchParams {
  sortBy: QuestionsOrderBy;
  questionId: string;
  resolved: string;
}

const EventQuestionsPage = async ({
  params: { ownerId, eventSlug },
  searchParams,
}: {
  params: TypeParams;
  searchParams?: SearchParams;
}) => {
  const orderBy = searchParams?.sortBy ?? 'newest';
  const showResolved = searchParams?.resolved === 'true';
  const questionId = searchParams?.questionId;

  const hasFilters = !!questionId;

  return (
    <>
      <div className='flex justify-between'>
        {/* Open or Resolved */}
        <QuestionsTabsNavigation ownerId={ownerId} eventSlug={eventSlug} />
        {/* Refresh */}
        <div className='inline-flex items-center lg:gap-x-5'>
          <RefreshButton />
          <div className='inline-flex items-center p-0.5 lg:gap-x-2'>
            <span className='hidden lg:inline-block text-nowrap text-sm text-muted-foreground'>Sort By:</span>
            <QuestionsSortBySelect sortBy={orderBy} />
          </div>
        </div>
      </div>

      {hasFilters && (
        <div className='flex items-center mt-3'>
          <div>You have active filters. </div>
          <ClearSearchButton />
        </div>
      )}

      <Suspense fallback={<Loader />}>
        <Questions showResolved={showResolved} ownerId={ownerId} eventSlug={eventSlug} questionId={questionId} orderBy={orderBy} />
      </Suspense>
    </>
  );
};

type Params = {
  showResolved: boolean;
  ownerId: string;
  eventSlug: string;
  questionId?: string;
  orderBy?: QuestionsOrderBy;
};

export const Questions = async ({ showResolved, ownerId, eventSlug, questionId, orderBy = 'newest' }: Params) => {
  const fetchQuestions = showResolved ? getEventResolvedQuestions : getEventOpenQuestions;

  const questions = await fetchQuestions({ eventSlug, ownerId, orderBy, ...(questionId ? { filters: { questionId } } : {}) });

  return showResolved ? (
    <ResolvedQuestions
      initialQuestions={questions}
      ownerId={ownerId}
      eventSlug={eventSlug}
      orderBy={orderBy}
      questionId={questionId}
      className='mt-5'
    />
  ) : (
    <OpenQuestions
      initialQuestions={questions}
      ownerId={ownerId}
      eventSlug={eventSlug}
      orderBy={orderBy}
      questionId={questionId}
      className='mt-5'
    />
  );
};

export default EventQuestionsPage;
