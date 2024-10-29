'use server';

import { getUserNotifications } from '../server/get-user-notification';
import { actionClient } from './safe.action';

export const getUserNotificationUnseenAction = actionClient.action(async () => getUserNotifications({ unseenOnly: true }));
