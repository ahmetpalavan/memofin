import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { DesktopDashboardSidebar, MobileDashboardSidebar } from '~/components/layout';
import routes from '~/config/routes';

export const dynamic = 'force-dynamic';

const DashboardLayout = async ({ children }: PropsWithChildren) => {
  const isAuthenticated = await getKindeServerSession().isAuthenticated();

  if (!isAuthenticated) {
    redirect(routes.login);
  }

  return (
    <div className='flex flex-row h-full'>
      <DesktopDashboardSidebar />
      <div className='flex flex-col overflow-auto w-full items-start grow'>
        <MobileDashboardSidebar />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
