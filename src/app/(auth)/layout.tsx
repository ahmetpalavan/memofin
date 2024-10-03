import { PropsWithChildren } from 'react';
import { Navbar } from '~/components/layout';

export const dynamic = 'force-dynamic';

const EventsLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <main className='h-[calc(100vh-4rem)]'>{children}</main>
    </>
  );
};

export default EventsLayout;
