'use client';

import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs';
import { BookMarked, Component, LogOut, Menu, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import routes from '~/config/routes';
import { cn, PropsWithClassName } from '~/lib/utils';
import { buttonVariants } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { SidebarItem } from './sidebar-item';

const sidebarItems = [
  {
    name: 'Your Events',
    route: routes.dashboard,
    Icon: Component,
  },
  {
    name: 'Bookmarks',
    route: routes.bookmarked,
    Icon: BookMarked,
  },
  {
    name: 'Account',
    route: routes.account,
    Icon: User,
  },
] as const;

export const DesktopDashboardSidebar = ({ className }: PropsWithClassName) => {
  return (
    <aside className={cn('border-r-green-500/30 h-full shrink-0 grow-0 bg-white border-r hidden lg:block lg:basis-[250px]', className)}>
      <DashboardSidebarContent />
    </aside>
  );
};

export const MobileDashboardSidebar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className='pl-4 pt-4 lg:hidden'>
        <div className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
          <Menu className='w-5 h-5 mr-0.5' />
          <span>Menu</span>
        </div>
      </SheetTrigger>

      <SheetContent className='w-[250px] p-0 pt-2' side={'left'}>
        <DashboardSidebarContent />
      </SheetContent>
    </Sheet>
  );
};

export const DashboardSidebarContent = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className='flex flex-col h-full py-6 px-3'>
      <nav className='flex flex-col gap-2'>
        {sidebarItems.map((item) => (
          <button key={item.route} onClick={() => router.replace(item.route)}>
            <SidebarItem isActive={pathname === item.route} text={item.name} icon={item.Icon} />
          </button>
        ))}
      </nav>
      <div className='w-full mt-auto'>
        <LogoutLink className={cn(buttonVariants({ variant: 'default' }), 'w-full rounded-sm')}>
          <LogOut size={16} />
          <span className='ml-2'>Logout</span>
        </LogoutLink>
      </div>
    </div>
  );
};
