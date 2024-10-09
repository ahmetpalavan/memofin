'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { match } from 'ts-pattern';
import { questionPageQueryParams } from '~/config/query-param';
import { QuestionsOrderBy } from '~/utils/question-utils';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

type Props = {
  sortBy: QuestionsOrderBy;
};

export const QuestionsSortBySelect = ({ sortBy }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleValueChange = useCallback(
    (value: QuestionsOrderBy) => {
      const newSearchParams = new URLSearchParams(searchParams);
      const orderBy = match(value)
        .returnType<QuestionsOrderBy | undefined>()
        .with('most-popular', () => 'most-popular')
        .with('newest', () => 'newest')
        .with('oldest', () => 'oldest')
        .otherwise(() => undefined);

      orderBy ? newSearchParams.set(questionPageQueryParams.sortBy, orderBy) : newSearchParams.delete(questionPageQueryParams.sortBy);

      router.replace(`${pathname}?${newSearchParams.toString()}`);
    },
    [pathname, router, searchParams]
  );

  return (
    <Select onValueChange={handleValueChange} defaultValue={sortBy} key={`${pathname}${searchParams.toString()}`}>
      <SelectTrigger className='w-full lg:w-[180px]'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={'most-popular' as QuestionsOrderBy}>Most Popular</SelectItem>
        <SelectItem value={'newest' as QuestionsOrderBy}>Newest</SelectItem>
        <SelectItem value={'oldest' as QuestionsOrderBy}>Oldest</SelectItem>
      </SelectContent>
    </Select>
  );
};
