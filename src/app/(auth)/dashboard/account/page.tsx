import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getUserInfo } from '~/lib/server/get-user-info';
import { onlyDateFormatter } from '~/lib/utils/date-utils';

const AccountPage = async () => {
  const kindeUser = await getKindeServerSession().getUser();

  const user = kindeUser && (await getUserInfo(kindeUser.id));

  if (!user) {
    throw new Error('User not found');
  }

  return (
    <div className='w-full h-full px-4 py-2'>
      <h1 className='text-2xl font-bold mt-3'>{user.name}</h1>

      <time className='text-xs font-bold text-muted-foreground' suppressHydrationWarning>
        Member since {onlyDateFormatter.format(user.createdAt)}
      </time>

      <ul className='text-sm text-muted-foreground mt-6 space-y-1'>
        <li>Events: {user._count.events}</li>
        <li>Questions Asked: {user._count.questions}</li>
        <li>Participating: {user._count.participations}</li>
        <li>Bookmarked Events: {user._count.bookmarks}</li>
      </ul>
    </div>
  );
};

export default AccountPage;
