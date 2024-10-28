'use server';

import { z } from 'zod';
import { getEventOpenQuestions } from '../server/get-event-open-questions';
import { questionIdSchema, questionOrderBySchema } from '~/validation/question-schema';
import { actionClient } from './safe.action';
import { eventPublicIdSchema } from '~/validation/event-schema';

export const getEventOpenQuestionsAction = actionClient
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
    getEventOpenQuestions({
      ownerId,
      eventSlug,
      orderBy,
      cursor,
      ...(questionId ? { filters: { questionId } } : {}),
    })
  );
