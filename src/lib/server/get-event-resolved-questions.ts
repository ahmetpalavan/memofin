import 'server-only';

import { Event, Question, User } from '@prisma/client';
import { cache } from 'react';
import { QuestionsOrderBy } from '~/utils/question-utils';
import { prisma } from '../prisma/client';
import { questionDetail, questionOrderBy } from '../prisma/validators/question-validator';

type Params = {
  eventSlug: Event['slug'];
  ownerId: User['id'];
  orderBy?: QuestionsOrderBy;
  cursor?: Question['id'];
  filters?: {
    questionId?: Question['id'];
  };
};

export const getEventResolvedQuestions = cache(async ({ eventSlug, ownerId, cursor, orderBy = 'most-popular', filters }: Params) => {
  return await prisma.question.findMany({
    where: {
      event: {
        ownerId,
        slug: eventSlug,
      },
      isResolved: true,
      ...(filters?.questionId ? { id: filters.questionId } : {}),
    },
    ...questionDetail,
    orderBy: [{ isPinned: 'desc' }, { ...questionOrderBy(orderBy) }],
    take: 10,
    skip: cursor ? 1 : 0,
    ...(cursor ? { cursor: { id: cursor } } : {}),
  });
});
