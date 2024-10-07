import BeatLoader from 'react-spinners/BeatLoader';
import { Skeleton } from './ui/skeleton';
import { cn, PropsWithClassName } from '~/lib/utils';
import { blue, green } from 'tailwindcss/colors';

export const Loader = () => {
  return (
    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
      <BeatLoader color={green[500]} size={16} />
    </div>
  );
};

export const AuthLoader = ({ className }: PropsWithClassName) => {
  return <Skeleton className={cn('w-32 h-10 bg-slate-200/50', className)} />;
};
