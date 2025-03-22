'use client';

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '../ui/shadcn/skeleton';
import axios from 'axios';
import { API_URL } from '@/constants';

export default function TotalSets() {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['totalSets'],
    queryFn: (): Promise<{
      success: boolean;
      data: number;
    }> =>
      axios
        .get(`${API_URL}/api/workouts/history/totals/sets`, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });

  if (isError) {
    console.log(error.message);

    return null;
  }

  if (isLoading || !data?.data) {
    return <Skeleton className='h-10 w-full' />;
  }

  return <span>{new Intl.NumberFormat('en-GB').format(data.data)}</span>;
}
