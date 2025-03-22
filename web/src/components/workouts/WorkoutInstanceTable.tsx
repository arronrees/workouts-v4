import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/shadcn/table';
import { Skeleton } from '../ui/shadcn/skeleton';
import { WorkoutInstance, WorkoutSetInstance } from '@/constant.types';
import { Fragment } from 'react/jsx-runtime';

interface Props {
  instance: WorkoutInstance;
  isLoading: boolean;
}

export default function WorkoutInstanceTable({ instance, isLoading }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Exercise</TableHead>
          <TableHead>Set</TableHead>
          <TableHead>Reps</TableHead>
          <TableHead>Measurement</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading &&
          [...Array(4)].map((_, i) => (
            <TableRow key={i}>
              {[...Array(4)].map((_, i) => (
                <TableCell key={i}>
                  <Skeleton className='h-10 w-full' />
                </TableCell>
              ))}
            </TableRow>
          ))}
        {instance.exercises.map((exercise) => (
          <Fragment key={exercise.id}>
            {exercise.sets.map((set: WorkoutSetInstance, index: number) => (
              <TableRow
                key={set.id}
                className={
                  index === exercise.sets.length - 1
                    ? 'border-b-4 border-slate-200'
                    : 'border-slate-100'
                }
              >
                <TableCell className='font-medium'>
                  {index === 0 && exercise.exercise?.name}
                </TableCell>
                <TableCell className='text-muted-foreground'>
                  {index + 1}
                </TableCell>
                <TableCell
                  className={`${
                    exercise.exercise.measurement === 'reps_only'
                      ? 'font-medium'
                      : ''
                  }`}
                >
                  {set.wasSkipped ||
                  exercise.exercise.measurement === 'time_or_distance' ||
                  exercise.exercise.measurement === 'time' ? (
                    <span>-</span>
                  ) : (
                    set.reps
                  )}
                </TableCell>
                <TableCell className='font-medium'>
                  {set.wasSkipped ? (
                    <span>-</span>
                  ) : exercise.exercise.measurement === 'reps_only' ? (
                    <span>-</span>
                  ) : exercise.exercise.measurement === 'weight' ? (
                    <Weight weight={set.weight} />
                  ) : exercise.exercise.measurement === 'time' ? (
                    <Time time={set.time} />
                  ) : exercise.exercise.measurement === 'time_or_distance' ? (
                    set.time ? (
                      <Time time={set.time} />
                    ) : (
                      <Distance distance={set.distance} />
                    )
                  ) : (
                    ''
                  )}
                </TableCell>
              </TableRow>
            ))}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}

function Weight({ weight }: { weight?: number | null }) {
  return weight ? weight + 'kg' : null;
}

function Time({ time }: { time?: number | null }) {
  return time ? time + ' minutes' : null;
}

function Distance({ distance }: { distance?: number | null }) {
  return distance ? distance + ' meters' : null;
}
