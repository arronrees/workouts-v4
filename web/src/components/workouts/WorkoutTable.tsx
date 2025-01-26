import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../../constants';
import axios from 'axios';
import { Workout, WorkoutExercise, WorkoutSet } from '../../constant.types';
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/shadcn/dialog';
import { Input } from '../ui/shadcn/input';

interface Props {
  id: string;
}

export default function WorkoutTable({ id }: Props) {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['workout', id],
    queryFn: (): Promise<{ success: boolean; data: Workout }> =>
      axios
        .get(`${API_URL}/api/workouts/${id}`, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });

  if (isError) {
    console.log(error.message);

    return (
      <p className='error__style'>
        There was an error fetching the workout, please try again.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Exercise</TableHead>
          <TableHead>Sets</TableHead>
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
          data?.data.exercises.map((exercise) => (
            <TableRow key={exercise.id}>
              <TableCell className='flex flex-col gap-1'>
                <span>{exercise.exercise.name}</span>
                <span className='text-muted-foreground'>
                  {exercise.exercise?.muscles
                    ?.map((muscle) => muscle.muscle.name)
                    .join(', ')}
                </span>
              </TableCell>
              <TableCell>{exercise.sets.length}</TableCell>
              <TableCell align='right'>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type='button'
                      variant='outline'
                      className='block ml-auto'
                    >
                      View Sets
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{exercise.exercise?.name}</DialogTitle>
                      <DialogDescription>
                        <span className='flex gap-2 text-muted-foreground mb-2'>
                          {exercise.exercise?.muscles
                            ?.map((muscle) => muscle.muscle.name)
                            .join(', ')}
                        </span>
                      </DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col gap-4'>
                      {exercise.sets.map((set, index) => (
                        <div key={set.id}>
                          <h3 className='font-semibold text-sm'>
                            Set {index + 1}
                          </h3>
                          <Set exercise={exercise} set={set} />
                        </div>
                      ))}
                    </div>
                    <DialogFooter className='sm:justify-start'>
                      <DialogClose asChild>
                        <Button type='button' variant='secondary'>
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

function Set({
  exercise,
  set,
}: {
  exercise: WorkoutExercise;
  set: WorkoutSet;
}) {
  return (
    <div className='flex gap-1'>
      {exercise.exercise.measurement === 'time' && (
        <div className='flex-1'>
          <span className='text-muted-foreground font-medium text-xs'>
            Time
          </span>
          <Input disabled value={set.time || 0} />
        </div>
      )}
      {exercise.exercise.measurement === 'distance' && (
        <div className='flex-1'>
          <span className='text-muted-foreground font-medium text-xs'>
            Distance
          </span>
          <Input disabled value={set.distance || 0} />
        </div>
      )}
      {exercise.exercise.measurement === 'reps_only' && (
        <div className='flex-1'>
          <span className='text-muted-foreground font-medium text-xs'>
            Reps
          </span>
          <Input disabled value={set.reps || 0} />
        </div>
      )}
      {exercise.exercise.measurement === 'weight' && (
        <>
          <div className='flex-1'>
            <span className='text-muted-foreground font-medium text-xs'>
              Reps
            </span>
            <Input disabled value={set.reps || 0} />
          </div>
          <div className='flex-1'>
            <span className='text-muted-foreground font-medium text-xs'>
              Weight
            </span>
            <Input disabled value={set.weight || 0} />
          </div>
        </>
      )}
      {exercise.exercise.measurement === 'time_or_distance' && (
        <>
          {set.time && (
            <div className='flex-1'>
              <span className='text-muted-foreground font-medium text-xs'>
                Time
              </span>
              <Input disabled value={set.time || 0} />
            </div>
          )}
          {set.distance && (
            <div className='flex-1'>
              <span className='text-muted-foreground font-medium text-xs'>
                Distance
              </span>
              <Input disabled value={set.distance || 0} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
