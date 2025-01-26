import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../../constants';
import axios from 'axios';
import { Workout } from '../../constant.types';
import { Link } from 'react-router-dom';
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

export default function WorkoutsTable() {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['workouts'],
    queryFn: (): Promise<{ success: boolean; data: Workout[] }> =>
      axios
        .get(`${API_URL}/api/workouts`, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });

  if (isError) {
    console.log(error.message);

    return (
      <p className='error__style'>
        There was an error fetching your workouts, please try again.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>No. of Exercises</TableHead>
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
          data?.data.map((workout) => (
            <TableRow key={workout.id}>
              <TableCell>
                <Link to={`/workouts/${workout.id}`}>{workout.name}</Link>
              </TableCell>
              <TableCell>{workout.exercises.length}</TableCell>
              <TableCell align='right'>
                <div className='flex gap-2 justify-end items-center ml-auto'>
                  <Button asChild variant='ghost' size='sm'>
                    <Link to={`/workouts/${workout.id}/edit`}>Edit</Link>
                  </Button>
                  <Button asChild variant='outline'>
                    <Link to={`/workouts/${workout.id}`}>View</Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
