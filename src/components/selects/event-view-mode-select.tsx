'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useCallback } from 'react';
import { match } from 'ts-pattern';
import { eventPageQueryParams } from '~/config/query-param';

const viewModes = ['admin', 'participant'] as const;

type ViewMode = (typeof viewModes)[number];

const asParticipantParam = eventPageQueryParams.asParticipant;

export const EventViewModeSelect = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const selectedViewMode: ViewMode = searchParams.get(asParticipantParam) ? 'participant' : 'admin';

  const handleValueChange = useCallback(
    (value: ViewMode) => {
      const params = new URLSearchParams(searchParams);

      match(value)
        .with('participant', () => {
          params.set(asParticipantParam, 'true');
        })
        .with('admin', () => {
          params.delete(asParticipantParam);
        });

      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  return (
    <Select defaultValue={selectedViewMode} onValueChange={handleValueChange}>
      <SelectTrigger className='w-full'>
        <SelectValue className='text-sm text-muted-foreground' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={'participant' as ViewMode}>Admin view</SelectItem>
        <SelectItem value={'admin' as ViewMode}>Participant view</SelectItem>
      </SelectContent>
    </Select>
  );
};
