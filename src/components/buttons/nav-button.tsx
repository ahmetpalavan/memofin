import { PropsWithChildren } from 'react';
import { cn } from '~/lib/utils';

type Props = PropsWithChildren<{
  isActive: boolean;
  onClick: () => void;
}>;

export const NavButton = ({ isActive, onClick, children }: Props) => {
  return (
    <button
      className={cn(
        'px-4 py-2 text-sm font-medium text-gray-700 transition-colors rounded-sm',
        isActive ? 'bg-primary' : 'hover:bg-gray-100'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
