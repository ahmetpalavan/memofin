'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

export const ClearSearchButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClearSearch = useCallback(() => {
    router.replace(`${pathname}`);
  }, [router, pathname]);

  return (
    <Button onClick={handleClearSearch} variant={'ghost'}>
      <X className='w-4 h-4 mr-2' />
      <span>Clear</span>
    </Button>
  );
};
