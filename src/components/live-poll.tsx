'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Circle, CircleCheckBig, Dot, OctagonPause, User, Users } from 'lucide-react';
import { useState } from 'react';
import { useParticipantView } from '~/hooks/use-participant-view';
import { PollDetails } from '~/lib/prisma/validators/poll-validator';
import { cn, PropsWithClassName } from '~/lib/utils';
import { Button } from './ui/button';
import { PollOption } from '@prisma/client';
import { getOptionVotesAsPercentage } from '~/utils/poll-utils';
import { PollVotersTooltip } from './tooltips/poll-voters-tooltip';
import { PollOptionMenu } from './menu/poll-option-menu';
import { ClosePollDialog } from './dialog/close-pool-dialog';

type Props = PropsWithClassName<{
  poll: PollDetails;
}>;

export const LivePoll = ({ poll, className }: Props) => {
  const { user } = useKindeBrowserClient();
  const [openCloseDialog, setOpenCloseDialog] = useState(false);

  const { isLive, options } = poll;
  const totalVotes = poll._count.votes;
  const voters = poll.votes.map((vote) => vote.author);

  const isAdmin = user?.id === poll.event.ownerId;
  const isParticipantView = useParticipantView();

  const showEndPollButton = isAdmin && !isParticipantView;

  const votedOptionIndex = 0;
  const votedOption = (optionId: number) => {};

  return (
    <>
      <div className={cn('border rounded-lg p-4', className)}>
        <div className='flex items-center gap-x-5'>
          {/* Live Badge */}
          <span className='inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full'>
            <Dot className='w-4 h-4 animate-pulse fill-green-50' />
            <span className='text-sm font-medium'>Live</span>
          </span>

          {/* End Button */}
          {showEndPollButton && (
            <Button className='space-x-1' variant='destructive' size='sm' onClick={() => setOpenCloseDialog(true)}>
              <OctagonPause className='w-4 h-4 mr-1' />
              <span>End</span>
            </Button>
          )}

          {/* Voter Avatar List */}
          <div className='inline-flex items-center gap-x-3 ml-auto'>
            <PollVotersTooltip pollTotalVotes={totalVotes} voters={voters} className='cursor-pointer' />
            <PollOptionMenu poll={poll} className='cursor-pointer' />
          </div>
        </div>
        <p className='font-bold mt-4'>{poll.body}</p>

        {/* Poll Options */}
        <div role='list' className='flex flex-col gap-y-2 mt-4'>
          {options.map((option) => (
            <PollOptionItem
              key={option.id}
              isPollClosed={!isLive}
              isVoted={option.index === votedOptionIndex}
              option={option}
              totalPollVotes={totalVotes}
              onVoteChange={() => votedOption(option.index)}
            />
          ))}
        </div>

        {/* Total Votes */}
        <div className='mt-4 ml-3 text-sm text-gray-600'>
          <User className='w-4 h-4 inline-block mr-1' />
          <span className='ml-1'>{totalVotes} total votes</span>
        </div>
      </div>
      <ClosePollDialog
        pollId={poll.id}
        onSucces={() => setOpenCloseDialog(false)}
        onOpenChange={setOpenCloseDialog}
        open={openCloseDialog}
      />
    </>
  );
};

export const ClosedPoll = ({ poll, className }: Props) => {
  const { user } = useKindeBrowserClient();

  const { options } = poll;

  const totalVotes = poll._count.votes;
  const voters = poll.votes.map((vote) => vote.author);

  const votedOptionIndex = poll.options.find((option) => option.votes.some((vote) => vote.authorId === user?.id))?.index;

  return (
    <div className={cn('border rounded-lg p-4', className)}>
      <div className='flex items-center gap-x-5'>
        {/* Closed badge */}
        <span className='ml-2 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full'>Closed</span>

        {/* Voter avatars list */}
        <div className='inline-flex items-center gap-x-3 ml-auto'>
          <PollVotersTooltip pollTotalVotes={totalVotes} voters={voters} />

          {/* <PollOptionsMenu poll={poll} /> */}
        </div>
      </div>

      {/* Poll body */}
      <p className='font-bold mt-4'>{poll.body}</p>

      {/* Poll options */}
      <div role='list' className='space-y-3 mt-4'>
        {options.map((option) => (
          <PollOptionItem
            onVoteChange={() => {}}
            key={option.id}
            option={option}
            isVoted={option.index === votedOptionIndex}
            totalPollVotes={totalVotes}
            isPollClosed={true}
          />
        ))}
      </div>

      {/* Total votes */}
      <p className='text-slate-400 text-sm mt-5 ml-3'>
        <Users className='inline-block mr-1' />
        {totalVotes} total votes
      </p>
    </div>
  );
};

const PollOptionItem = ({
  isPollClosed,
  isVoted,
  option,
  totalPollVotes,
  onVoteChange,
}: {
  option: PollDetails['options'][number];
  isVoted: boolean;
  totalPollVotes: number;
  isPollClosed: boolean;
  onVoteChange?: (optionId: PollOption['id']) => void;
}) => {
  const percentage = getOptionVotesAsPercentage({
    optionVotes: option._count.votes,
    totalVotes: totalPollVotes,
  });

  return (
    <button
      role='listitem'
      className={cn(
        'relative text-sm flex w-full justify-between border p-4 rounded-sm disabled:cursor-not-allowed disabled:opacity-70',
        isVoted && 'ring-green-800 ring-2 ring-opacity-80'
      )}
      disabled={isPollClosed}
      onClick={() => onVoteChange?.(option.id)}
    >
      <div className='inline-flex items-center gap-x-2'>
        {isVoted ? <CircleCheckBig className='w-5 h-5 stroke-green-800' /> : <Circle className='w-5 h-5 stroke-gray-600' />}
        <p className='font-medium'>{option.body}</p>
      </div>
      <p>{option._count.votes} votes</p>
      <div style={{ width: `${percentage}%` }} className='absolute inset-0 bg-green-300/30 rounded-sm transition-all duration-300' />
    </button>
  );
};
