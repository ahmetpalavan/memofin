import { z } from 'zod';
import { event } from './constant';

export const eventIdSchema = z.string().cuid();

export const eventSlugSchema = z
  .string()
  .min(event.slug.minLength, {
    message: `Slug must be at least ${event.slug.minLength} characters`,
  })
  .max(event.slug.maxLength, {
    message: `Slug must be at most ${event.slug.maxLength} characters`,
  });

export const eventPublicIdSchema = z.object({
  ownerId: z.string().min(35),
  eventSlug: eventSlugSchema,
});

export const shortDescriptionSchema = z
  .string()
  .min(event.shortDescription.minLength, {
    message: `Short description must be at least ${event.shortDescription.minLength} characters`,
  })
  .max(event.shortDescription.maxLength, {
    message: `Short description must be at most ${event.shortDescription.maxLength} characters`,
  });

export const updateEventSchema = z.object({
  eventId: eventIdSchema,
  shortDescription: shortDescriptionSchema,
});

export const deleteEventSchema = z.object({
  eventId: eventIdSchema,
});

export const createEventSchema = z.object({
  title: z
    .string()
    .min(event.name.minLength, {
      message: `Title must be at least ${event.name.minLength} characters`,
    })
    .max(event.name.maxLength, {
      message: `Title must be at most ${event.name.maxLength} characters`,
    }),
  shortDescription: shortDescriptionSchema,
});

export type CreateEventSchema = z.infer<typeof createEventSchema>;
export type UpdateEventSchema = z.infer<typeof updateEventSchema>;
export type DeleteEventSchema = z.infer<typeof deleteEventSchema>;
