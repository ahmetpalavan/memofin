import { z } from 'zod';

export const notificationIdSchema = z.string().cuid();

export const readNotification = z.object({
  notificationId: notificationIdSchema,
});

export type ReadNotificationSchema = z.infer<typeof readNotification>;
