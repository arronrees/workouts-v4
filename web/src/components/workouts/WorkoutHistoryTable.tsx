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
import { WorkoutExerciseInstance, WorkoutInstance } from '@/constant.types';

interface Props {
  isError: boolean;
  isLoading: boolean;
  error: Error | null;
  data?: WorkoutInstance[];
  showWorkout?: boolean;
}

export default function WorkoutHistoryTable({
  isError,
  isLoading,
  error,
  data,
  showWorkout,
}: Props) {
  if (isError) {
    console.log(error?.message);

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
          {showWorkout && <TableHead>Workout</TableHead>}
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
        {data &&
          data.map((instance) => (
            <TableRow key={instance.id}>
              <TableCell>
                <span>{new Date(instance.createdAt).toDateString()}</span>
              </TableCell>
              {showWorkout && <TableCell>{instance.workout.name}</TableCell>}
              <TableCell>
                <WeightLifted exercises={instance.exercises} />
              </TableCell>
              <TableCell align='right'>
                <Button type='button' variant='outline' asChild>
                  <Link
                    to={`/workouts/${instance.workoutId}/history/${instance.id}`}
                  >
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
