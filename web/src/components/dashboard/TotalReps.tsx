'use client';

import { API_URL } from '@/constants';
import { Skeleton } from '../ui/shadcn/skeleton';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

interface TotalRepsData {
  reps: number;
}

export default function TotalReps() {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['totalReps'],
    queryFn: (): Promise<{
      success: boolean;
      data: TotalRepsData[];
    }> =>
      axios
        .get(`${API_URL}/api/workouts/history/totals/reps`, {
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

  return <span>{data.data.reduce((prev, curr) => prev + curr.reps, 0)}</span>;
}
