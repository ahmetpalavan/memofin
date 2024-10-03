import { VoteIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import routes from '~/config/routes';
import { AuthLoader } from '../loader';
import { AuthButtons } from '../buttons/auth-buttons';

export const Navbar = () => {
  return (
    <header className='bg-primary text-primary-foreground h-16 flex justify-between items-center px-4 lg:px-8 shrink-0 grow-0'>
      <Link href={routes.home} className='inline-flex items-end gap-x-2'>
        <Logo />
        <span className='tracking-widest font-bold'>Memofin</span>
      </Link>
      <Suspense fallback={<AuthLoader />}>
        <AuthButtons />
      </Suspense>
    </header>
  );
};

const Logo = () => <VoteIcon color='white' size={28} />;
