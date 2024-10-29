import { useAction } from 'next-safe-action/hooks';
import { useCallback, useEffect, useState } from 'react';
import { getUserNotificationUnseenAction } from '~/lib/actions/get-user-notification-unseen.action';
import { getUserNotificationAction } from '~/lib/actions/get-user-notification.action';
import { readNotificationAction } from '~/lib/actions/read-notification.action';
import { NotificationDetail } from '~/lib/prisma/validators/notification-validator';

type Params = {
  initialNotifications: NotificationDetail[];
};

export const useNotification = ({ initialNotifications }: Params) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(false);

  const [showDot, setShowDot] = useState(initialNotifications.some((nt) => !nt.read));

  const { execute: readNotification } = useAction(readNotificationAction);
  const { executeAsync: getUserNotifications } = useAction(getUserNotificationAction);
  const { executeAsync: getUserNotificationUnseen } = useAction(getUserNotificationUnseenAction);

  const loadMoreNotifications = useCallback(async () => {
    const newNotifications = await getUserNotifications({ cursor: notifications.at(-1)?.id });

    if (newNotifications?.data?.length) {
      setNotifications((prev) => [...prev, ...(newNotifications.data || [])]);
    } else {
      setHasMoreNotifications(false);
    }
  }, [getUserNotifications, notifications]);

  const markNotificationAsRead = (notification: NotificationDetail) => {
    if (!notification.read) {
      setNotifications((prev) =>
        prev.map((nt) =>
          nt.id === notification.id
            ? {
                ...nt,
                read: true,
              }
            : nt
        )
      );

      readNotification({ notificationId: notification.id });
    }
  };

  useEffect(() => {
    const fetchUnseenNotifications = async () => {
      const unseenNotification = await getUserNotificationUnseen();

      if (!unseenNotification?.data || unseenNotification.data.length === 0) {
        return;
      }

      setShowDot(true);
      setNotifications((prev) => [...(unseenNotification.data || []), ...prev]);
    };

    const interval = setInterval(fetchUnseenNotifications, 10_000);

    return () => {
      clearInterval(interval);
    };
  }, [getUserNotificationUnseen]);

  return {
    notifications,
    setNotifications,
    hasMoreNotifications,
    setHasMoreNotifications,
    showDot,
    setShowDot,
    loadMoreNotifications,
    markNotificationAsRead,
  };
};
