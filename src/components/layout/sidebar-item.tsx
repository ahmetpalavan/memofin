import { ComponentType, PropsWithChildren } from 'react';
import { PropsWithClassName, cn } from '~/lib/utils';

type SidebarItemProps = PropsWithChildren<{
  isActive?: boolean;
  text: string;
  icon: ComponentType<PropsWithClassName>;
}>;

export const SidebarItem = ({ isActive, text, icon: Icon, children }: SidebarItemProps) => {
  return (
    <div
      role='item'
      className={cn(
        'flex items-center gap-x-2 p-4 rounded-sm transition-colors duration-200 select-none',
        isActive ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-transparent/10'
      )}
    >
      <Icon className='w-4 h-4' />
      <span>{text}</span>
      {children}
    </div>
  );
};
