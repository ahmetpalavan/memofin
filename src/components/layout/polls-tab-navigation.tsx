'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { eventPollsQueryParams } from '~/config/query-param';
import routes from '~/config/routes';
import { NavButton } from '../buttons/nav-button';

type PollsTab = 'closed' | 'live';

type Props = {
  ownerId: string;
  eventSlug: string;
};

export const PollsTabNavigation = ({ ownerId, eventSlug }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const showClosed = searchParams.get(eventPollsQueryParams.closed) === 'true';
  const eventPollsUrl = routes.eventPolls({ ownerId, eventSlug });
  const activeTab: PollsTab = pathname === eventPollsUrl && !showClosed ? 'live' : 'closed';

  const handleTabChange = useCallback(
    (tab: PollsTab) => {
      const newSearchParams = new URLSearchParams();
      if (tab === 'closed') {
        newSearchParams.set(eventPollsQueryParams.closed, 'true');
      }

      router.replace(`${eventPollsUrl}?${newSearchParams.toString()}`);
    },
    [router, eventPollsUrl, searchParams]
  );

  return (
    <nav className='inline-flex'>
      <NavButton isActive={activeTab === 'live'} onClick={() => handleTabChange('live')}>
        Live
      </NavButton>
      <NavButton isActive={activeTab === 'closed'} onClick={() => handleTabChange('closed')}>
        Closed
      </NavButton>
    </nav>
  );
};
