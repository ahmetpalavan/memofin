import Link from 'next/link';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cn, PropsWithClassName } from '~/lib/utils';
import { EventDetail } from '~/lib/prisma/validators/event-validator';
import routes from '~/config/routes';
import { Users } from 'lucide-react';

type Props = PropsWithClassName<{
  event: EventDetail;
}>;

export const EventCard = ({ event, className }: Props) => {
  const questionsCount = event._count.questions;
  const pollsCount = event._count.polls;
  const participantsCount = event._count.participants;

  return (
    <Link
      href={routes.event({
        ownerId: event.ownerId,
        eventSlug: event.slug,
      })}
      prefetch={false}
    >
      <Card className={cn('rounded-lg border-l-[4px] border-b-0 border-t-0 border-r-0 border-red-400/80', className)}>
        <CardHeader>
          <div className='flex justify-between'>
            <h4 className='text-base font-bold line-clamp-2'>{event.name}</h4>
          </div>

          <div className='flex justify-between text-[12px] text-muted-foreground font-medium'>
            <span>
              <span>Q&A: {questionsCount}</span>
              <span className='mx-2'>&bull;</span>
              <span>Polls: {pollsCount}</span>
            </span>

            <span className='inline-flex gap-x-1 items-center font-bold'>
              <Users className='w-3 h-3' />
              <span>{participantsCount} participants</span>
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <p className='text-muted-foreground text-xs line-clamp-2'>{event.shortDescription}</p>
        </CardContent>
      </Card>
    </Link>
  );
};
