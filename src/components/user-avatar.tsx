import { PropsWithClassName } from '~/lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';

type UserAvatarProps = PropsWithClassName<{
  displayName: string;
  color: string;
}>;

const getFullNameInitials = (displayName: string) => {
  const initials = displayName.match(/\b\w/g) || [];

  return initials.join('').toUpperCase();
};

export const UserAvatar = ({ displayName, color, className }: UserAvatarProps) => {
  return (
    <Avatar className={className}>
      <AvatarFallback className='flex items-center justify-center' style={{ backgroundColor: color }}>
        <span className='text-white font-bold text-sm'>{getFullNameInitials(displayName)}</span>
      </AvatarFallback>
    </Avatar>
  );
};
