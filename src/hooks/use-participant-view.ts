import { useSearchParams } from 'next/navigation';
import { eventPageQueryParams } from '~/config/query-param';

export const useParticipantView = () => {
  const params = useSearchParams();

  return params.get(eventPageQueryParams.asParticipant) === 'true';
};
