'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { questionPageQueryParams } from '~/config/query-param';
import routes from '~/config/routes';
import { NavButton } from '../buttons/nav-button';

type QuestionsTabs = 'open' | 'resolved';

interface TypeParams {
  ownerId: string;
  eventSlug: string;
}

export const QuestionsTabsNavigation = ({ eventSlug, ownerId }: TypeParams) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const showResolved = searchParams.get(questionPageQueryParams.resolved) === 'true';

  const eventQuestionsRoute = routes.event({ eventSlug, ownerId });

  const activeTab: QuestionsTabs = pathname === eventQuestionsRoute && !showResolved ? 'open' : 'resolved';

  const handleTabChange = useCallback(
    (tab: QuestionsTabs) => {
      const newParams = new URLSearchParams();

      if (tab === 'resolved') {
        newParams.set(questionPageQueryParams.resolved, 'true');
      }

      router.replace(`${eventQuestionsRoute}?${newParams.toString()}`);
    },
    [router, eventQuestionsRoute]
  );

  return (
    <nav className='inline-flex'>
      <NavButton onClick={() => handleTabChange('open')} isActive={activeTab === 'open'}>
        Open
      </NavButton>
      <NavButton onClick={() => handleTabChange('resolved')} isActive={activeTab === 'resolved'}>
        Resolved
      </NavButton>
    </nav>
  );
};
