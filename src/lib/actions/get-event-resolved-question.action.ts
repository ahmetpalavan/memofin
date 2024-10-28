'use server';

import { z } from 'zod';
import { eventPublicIdSchema } from '~/validation/event-schema';
import { questionIdSchema, questionOrderBySchema } from '~/validation/question-schema';
import { getEventResolvedQuestions } from '../server/get-event-resolved-questions';
import { actionClient } from './safe.action';

export const getEventResolvedQuestionsAction = actionClient
  .schema(
    z
      .object({
        cursor: questionIdSchema.optional(),
        orderBy: questionOrderBySchema.optional(),
        questionId: questionIdSchema.optional(),
      })
      .merge(eventPublicIdSchema)
  )
  .action(async ({ parsedInput: { cursor, ownerId, eventSlug, orderBy, questionId } }) =>
    getEventResolvedQuestions({
      eventSlug,
      ownerId,
      cursor,
      orderBy,
      ...(questionId ? { filters: { questionId } } : {}),
    })
  );
