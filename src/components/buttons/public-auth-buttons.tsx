'use client';

import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs';
import React from 'react';
import { cn, PropsWithClassName } from '~/lib/utils';
import { buttonVariants } from '../ui/button';
import { usePathname } from 'next/navigation';
import { BASE_URL } from '~/config/routes';

export const PublicAuthButtons = ({ className }: PropsWithClassName) => {
  const pathname = usePathname();

  return (
    <div className={cn('inline-flex space-x-4', className)}>
      <LoginLink className={cn(buttonVariants({ variant: 'default' }), 'ring-1 ring-white')}>Login</LoginLink>
      <RegisterLink className={cn(buttonVariants({ variant: 'destructive' }), 'ring-1 ring-white')}>Register</RegisterLink>
    </div>
  );
};
