import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import routes from '~/config/routes';
import { getUserInfo } from '~/lib/server/get-user-info';
import { UserAvatar } from '../user-avatar';
import { cn, PropsWithClassName } from '~/lib/utils';
import { PublicAuthButtons } from './public-auth-buttons';

export const AuthButtons = async ({ className }: PropsWithClassName) => {
  const kindeUser = await getKindeServerSession().getUser();

  const user = kindeUser && (await getUserInfo(kindeUser.id));

  return user ? (
    <div className={cn('inline-flex gap-x-7 items-center', className)}>
      <Bell className='w-6 h-6' />
      <Link href={routes.dashboard} prefetch={false}>
        <UserAvatar color={user.color} displayName={user.name} className='ring-2 ring-white' />
      </Link>
    </div>
  ) : (
    <PublicAuthButtons className={className} />
  );
};
