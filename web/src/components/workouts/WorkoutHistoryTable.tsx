import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/shadcn/table';
import { Button } from '../ui/shadcn/button';
import { Skeleton } from '../ui/shadcn/skeleton';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/constants';
import axios from 'axios';
import { WorkoutExerciseInstance, WorkoutInstance } from '@/constant.types';

interface Props {
  id: string;
}

export default function WorkoutHistoryTable({ id }: Props) {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['workout-history', id],
    queryFn: (): Promise<{ success: boolean; data: WorkoutInstance[] }> =>
      axios
        .get(`${API_URL}/api/workouts/history/${id}`, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });

  if (isError) {
    console.log(error.message);

    return (
      <p className='error__style'>
        There was an error fetching the workout history, please try again.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Weight Lifted</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading &&
          [...Array(3)].map((_, i) => (
            <TableRow key={i}>
              {[...Array(3)].map((_, i) => (
                <TableCell key={i}>
                  <Skeleton className='h-10 w-full' />
                </TableCell>
              ))}
            </TableRow>
          ))}
        {data?.data &&
          data.data.map((instance) => (
            <TableRow key={instance.id}>
              <TableCell>
                <span>{new Date(instance.createdAt).toDateString()}</span>
              </TableCell>
              <TableCell>
                <WeightLifted exercises={instance.exercises} />
              </TableCell>
              <TableCell align='right'>
                <Button type='button' variant='outline' asChild>
                  <Link to={`/workouts/${id}/history/${instance.id}`}>
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

function WeightLifted({ exercises }: { exercises: WorkoutExerciseInstance[] }) {
  const weight = exercises.reduce(
    (prev: number, curr: WorkoutExerciseInstance) => {
      return (
        prev +
        curr.sets.reduce((p, c) => {
          return p + (c.reps ?? 0) * (c.weight ?? 0);
        }, 0)
      );
    },
    0
  );

  return <span className='font-medium'>{weight} (kg)</span>;
}
