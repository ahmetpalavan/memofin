import { Event, User } from '@prisma/client';
import { QuestionDetail } from '~/lib/prisma/validators/question-validator';
import { cn, PropsWithClassName } from '~/lib/utils';
import { QuestionsOrderBy } from '~/utils/question-utils';
import { NoContent } from './illustrations';
import { Question } from './question';

type Props = PropsWithClassName<{
  initialQuestions: QuestionDetail[];
  ownerId: User['id'];
  eventSlug: Event['slug'];
  orderBy: QuestionsOrderBy;
  questionId?: QuestionDetail['id'];
}>;

export const OpenQuestions = async ({ initialQuestions, ownerId, eventSlug, orderBy, questionId, className }: Props) => {
  const hasFilters = !!questionId;
  return (
    <div className={cn('space-y-8 pb-10', className)}>
      {initialQuestions.length === 0 ? (
        <NoContent>
          <span className={cn('text-center text-lg font-medium text-muted-foreground', hasFilters ? 'mt-5' : 'mt-0')}>
            {hasFilters ? 'No questions found with the applied filters.' : 'No open questions found.'}
          </span>
        </NoContent>
      ) : (
        initialQuestions.map((question) => <Question key={question.id} question={question} />)
      )}
    </div>
  );
};

export const ResolvedQuestions = async ({ initialQuestions, ownerId, eventSlug, orderBy, questionId, className }: Props) => {
  return (
    <div className={cn('space-y-8 pb-10', className)}>
      {initialQuestions.length === 0 ? (
        <NoContent>
          <span className={cn('text-center text-lg font-medium text-muted-foreground', 'mt-0')}>No resolved questions found.</span>
        </NoContent>
      ) : (
        initialQuestions.map((question) => <Question key={question.id} question={question} />)
      )}
    </div>
  );
};
