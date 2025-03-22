'use client';

import { API_URL } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Skeleton } from '../ui/shadcn/skeleton';

interface TotalWeightData {
  weight: number;
  reps: number;
}

export default function TotalWeight() {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['totalWeight'],
    queryFn: (): Promise<{
      success: boolean;
      data: TotalWeightData[];
    }> =>
      axios
        .get(`${API_URL}/api/workouts/history/totals/weight`, {
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

  return (
    <span>
      {new Intl.NumberFormat('en-GB').format(
        data?.data?.reduce((prev, curr) => prev + curr.reps * curr.weight, 0)
      )}{' '}
      kg
    </span>
  );
}
