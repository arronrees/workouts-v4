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
import { ExerciseProgressionHistory } from '@/pages/exercises/Show';
import { useEffect, useState } from 'react';
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
import {
  Exercise,
  WorkoutExercise,
  WorkoutExerciseInstance,
  WorkoutSet,
  WorkoutSetInstance,
} from '@/constant.types';

interface Props {
  isLoading: boolean;
  history: ExerciseProgressionHistory[];
}

export default function ExerciseTable({ isLoading, history }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Workout</TableHead>
          <TableHead>Reps</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead>Previous</TableHead>
          <TableHead>Target</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading &&
          [...Array(6)].map((_, i) => (
            <TableRow key={i}>
              {[...Array(6)].map((_, i) => (
                <TableCell key={i}>
                  <Skeleton className='h-10 w-full' />
                </TableCell>
              ))}
            </TableRow>
          ))}
        {history &&
          history.map((instance, index) => (
            <ExerciseRow
              key={instance.id}
              instance={instance}
              next={history[index + 1]}
            />
          ))}
      </TableBody>
    </Table>
  );
}

function ExerciseRow({
  instance,
  next,
}: {
  instance: ExerciseProgressionHistory;
  next?: ExerciseProgressionHistory;
}) {
  const [latestWeight, setLatestWeight] = useState<number>(0);
  const [previousWeight, setPreviousWeight] = useState<number>(0);
  const [targetWeight, setTargetWeight] = useState<number>(0);

  const [percentageOnPreviousWeight, setPercentageOnPreviousWeight] = useState<
    number | null
  >(null);
  const [percentageOnTarget, setPercentageOnTarget] = useState<number | null>(
    null
  );

  useEffect(() => {
    let hasSets: boolean = false;

    instance.exercises.forEach((exercise) => {
      if (exercise.sets && exercise.sets.length > 0) {
        hasSets = true;
      }
    });

    if (hasSets) {
      setLatestWeight(
        instance.exercises.reduce(
          (prev: number, curr: WorkoutExerciseInstance) =>
            prev +
            (curr.sets
              ? curr.sets.reduce(
                  (p, c) => p + (c.weight ?? 0) * (c.reps ?? 0),
                  0
                )
              : 0),
          0
        )
      );

      setTargetWeight(
        instance.workout.exercises.reduce(
          (prev: number, curr: WorkoutExercise) =>
            prev +
            (curr.sets
              ? curr.sets.reduce(
                  (p: number, c: WorkoutSet) =>
                    p + (c.weight ?? 0) * (c.reps ?? 0),
                  0
                )
              : 0),
          0
        )
      );

      if (next?.workout.id === instance.workout.id) {
        setPreviousWeight(
          next.exercises.reduce(
            (prev: number, curr: WorkoutExerciseInstance) =>
              prev +
              (curr && curr?.sets
                ? curr?.sets.reduce(
                    (p: number, c: WorkoutSetInstance) =>
                      p + (c.weight ?? 0) * (c.reps ?? 0),
                    0
                  )
                : 0),
            0
          )
        );
      }
    }
  }, [instance.exercises, instance, next]);

  useEffect(() => {
    if (previousWeight > 0) {
      setPercentageOnPreviousWeight(
        ((latestWeight - previousWeight) / previousWeight) * 100
      );
    }

    if (targetWeight > 0) {
      setPercentageOnTarget(
        ((latestWeight - targetWeight) / targetWeight) * 100
      );
    }
  }, [latestWeight, previousWeight, targetWeight]);

  return (
    <TableRow>
      <TableCell>
        <span className='flex flex-col gap-1'>
          <Link
            to={`/workouts/${instance.workout.id}/history/${instance.id}`}
            className='font-medium'
          >
            {instance.workout.name}
          </Link>
          <span className='text-muted-foreground text-xs'>
            {new Date(instance.createdAt).toDateString()}
          </span>
        </span>
      </TableCell>
      <TableCell>
        {instance.exercises.reduce(
          (prev: number, curr: WorkoutExerciseInstance) =>
            prev +
            curr.sets.reduce(
              (p: number, c: WorkoutSetInstance) => p + (c.reps ?? 0),
              0
            ),
          0
        )}
      </TableCell>
      <TableCell className='font-medium'>{latestWeight}kg</TableCell>
      <TableCell>
        {(!!percentageOnPreviousWeight || percentageOnPreviousWeight === 0) && (
          <span className='flex gap-2 items-center'>
            <span
              className={
                percentageOnPreviousWeight >= 0
                  ? 'text-green-600 bg-green-100 px-1'
                  : 'text-red-500 bg-red-100 rounded-sm px-1'
              }
            >
              {percentageOnPreviousWeight?.toFixed(2)}%
            </span>
            <span className='text-muted-foreground text-xs'>
              ({previousWeight} kg)
            </span>
          </span>
        )}
      </TableCell>
      <TableCell>
        {(!!percentageOnTarget || percentageOnTarget === 0) && (
          <span className='flex gap-2 items-center'>
            <span
              className={
                percentageOnTarget >= 0
                  ? 'text-green-600 bg-green-100 px-1'
                  : 'text-red-500 bg-red-100 rounded-sm px-1'
              }
            >
              {percentageOnTarget.toFixed(2)}%
            </span>
            <span className='text-muted-foreground text-xs'>
              ({targetWeight} kg)
            </span>
          </span>
        )}
      </TableCell>
      <TableCell align='right'>
        <Dialog>
          <DialogTrigger asChild>
            <Button type='button' variant='outline' className='block ml-auto'>
              View Sets
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{instance.workout.name}</DialogTitle>
              <DialogDescription>
                <span className='flex gap-2 text-muted-foreground mb-2'>
                  {new Date(instance.createdAt).toDateString()}
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-4'>
              {instance.exercises[0].sets
                .filter((set) => !set.wasSkipped)
                .map((set: WorkoutSetInstance, index: number) => (
                  <div key={set.id}>
                    <h3 className='font-semibold text-sm'>Set {index + 1}</h3>
                    <Set exercise={instance.exercises[0].exercise} set={set} />
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
  );
}

function Set({ exercise, set }: { exercise: Exercise; set: WorkoutSet }) {
  return (
    <div className='flex gap-1'>
      {exercise.measurement === 'time' && (
        <div className='flex-1'>
          <span className='text-muted-foreground font-medium text-xs'>
            Time (minutes)
          </span>
          <Input disabled value={set.time || 0} />
        </div>
      )}
      {exercise.measurement === 'distance' && (
        <div className='flex-1'>
          <span className='text-muted-foreground font-medium text-xs'>
            Distance (meters)
          </span>
          <Input disabled value={set.distance || 0} />
        </div>
      )}
      {exercise.measurement === 'reps_only' && (
        <div className='flex-1'>
          <span className='text-muted-foreground font-medium text-xs'>
            Reps
          </span>
          <Input disabled value={set.reps || 0} />
        </div>
      )}
      {exercise.measurement === 'weight' && (
        <>
          <div className='flex-1'>
            <span className='text-muted-foreground font-medium text-xs'>
              Reps
            </span>
            <Input disabled value={set.reps || 0} />
          </div>
          <div className='flex-1'>
            <span className='text-muted-foreground font-medium text-xs'>
              Weight (kg)
            </span>
            <Input disabled value={set.weight || 0} />
          </div>
        </>
      )}
      {exercise.measurement === 'time_or_distance' && (
        <>
          {set.time && (
            <div className='flex-1'>
              <span className='text-muted-foreground font-medium text-xs'>
                Time (minutes)
              </span>
              <Input disabled value={set.time || 0} />
            </div>
          )}
          {set.distance && (
            <div className='flex-1'>
              <span className='text-muted-foreground font-medium text-xs'>
                Distance (meters)
              </span>
              <Input disabled value={set.distance || 0} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
