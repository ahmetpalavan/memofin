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
