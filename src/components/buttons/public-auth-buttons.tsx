'use client';

import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs';
import { cn, PropsWithClassName } from '~/lib/utils';
import { buttonVariants } from '../ui/button';

export const PublicAuthButtons = ({ className }: PropsWithClassName) => {
  return (
    <div className={cn('inline-flex space-x-4', className)}>
      <LoginLink className={cn(buttonVariants({ variant: 'default' }), 'ring-1 ring-white')}>Login</LoginLink>
      <RegisterLink className={cn(buttonVariants({ variant: 'destructive' }), 'ring-1 ring-white')}>Register</RegisterLink>
    </div>
  );
};
