import { User } from '@prisma/client';
import { PropsWithClassName } from '~/lib/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { UserAvatar } from '../user-avatar';

type Props = PropsWithClassName<{
  voters: Pick<User, 'color' | 'name'>[];
  pollTotalVotes: number;
}>;

export const PollVotersTooltip = ({ voters, pollTotalVotes, className }: Props) => {
  const votersToDisplay = voters.slice(0, 5);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={className}>
          <div className='flex -space-x-4'>
            {votersToDisplay.map((voter) => (
              <UserAvatar color={voter.color} displayName={voter.name} key={voter.name} className='w-8 h-8 ring-2 ring-white' />
            ))}
            {voters.length > 5 && (
              <Avatar className='w-8 h-8 ring-2 ring-white'>
                <AvatarFallback className='text-black text-sm bg-gray-200'>+{voters.length - 5}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className='bg-primary text-white text-sm'>{pollTotalVotes} votes</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
