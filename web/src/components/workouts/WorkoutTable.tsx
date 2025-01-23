import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../../constants';
import axios from 'axios';
import { ScaleLoader } from 'react-spinners';
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

export default function WorkoutTable() {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['workouts'],
    queryFn: (): Promise<{ success: boolean; data: Workout[] }> =>
      axios
        .get(`${API_URL}/api/workouts`, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className='p-6 flex items-center justify-center'>
        <ScaleLoader color='#334155' height={32} />
      </div>
    );
  }

  if (isError) {
    console.log(error.message);

    return (
      <p className='bg-red-200 text-sm p-4'>
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
        {data?.data &&
          data?.data.map((workout) => (
            <TableRow key={workout.id}>
              <TableCell>
                <Link to={`/workouts/${workout.id}`}>{workout.name}</Link>
              </TableCell>
              <TableCell>{workout.exercises.length}</TableCell>
              <TableCell>
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
