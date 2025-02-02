import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../../constants';
import axios from 'axios';
import {
  ExerciseMuscleGroup,
  WorkoutSet,
  WorkoutSetInstance,
} from '../../constant.types';
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
import { useEffect, useState } from 'react';

interface WorkoutExercise {
  id: string;
  exerciseId: string;
  workoutId: string;
  sortOrder: number;
  sets: WorkoutSet[];
  notes?: string;
  exerciseInstances?: WorkoutExerciseInstance[];
}

interface WorkoutExerciseInstance {
  id: string;
  exerciseId: string;
  workoutId: string;
  sortOrder: number;
  sets?: WorkoutSetInstance[];
  notes?: string;
  wasSkipped: boolean;
}

interface ExerciseProgression {
  id: string;
  name: string;
  measurement:
    | 'time'
    | 'reps_only'
    | 'weight'
    | 'time_or_distance'
    | 'distance';
  equipmentNeeded: 'Full' | 'Basic' | 'None';
  muscles: ExerciseMuscleGroup[];
  workoutExercises: WorkoutExercise[];
}

export default function ExercisesTable() {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['workout-exercises'],
    queryFn: (): Promise<{ success: boolean; data: ExerciseProgression[] }> =>
      axios
        .get(`${API_URL}/api/workout-exercises`, {
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
          <TableHead>Latest workout</TableHead>
          <TableHead>Previous workout</TableHead>
          <TableHead>Target</TableHead>
          <TableHead>PB</TableHead>
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
        {data?.data &&
          data?.data.map((exercise) => (
            <ExerciseRow key={exercise.id} exercise={exercise} />
          ))}
      </TableBody>
    </Table>
  );
}

function ExerciseRow({ exercise }: { exercise: ExerciseProgression }) {
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
    let hasPreviousWorkout: boolean = false;

    exercise.workoutExercises.forEach((exercise) => {
      if (
        exercise.exerciseInstances &&
        exercise.exerciseInstances?.length > 1
      ) {
        hasPreviousWorkout = true;
      }
      exercise.exerciseInstances?.forEach((instance) => {
        if (instance.sets && instance.sets.length > 0) {
          hasSets = true;
        }
      });
    });

    if (hasSets) {
      setLatestWeight(
        exercise.workoutExercises.reduce(
          (prev, curr) =>
            prev +
            (curr.exerciseInstances && curr.exerciseInstances[0].sets
              ? curr.exerciseInstances[0].sets.reduce(
                  (p, c) => p + (c.weight ?? 0) * (c.reps ?? 0),
                  0
                )
              : 0),
          0
        )
      );

      setTargetWeight(
        exercise.workoutExercises.reduce(
          (prev, curr) =>
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

      if (hasPreviousWorkout) {
        setPreviousWeight(
          exercise.workoutExercises.reduce(
            (prev, curr) =>
              prev +
              (curr.exerciseInstances && curr.exerciseInstances[1]?.sets
                ? curr.exerciseInstances[1]?.sets.reduce(
                    (p, c) => p + (c.weight ?? 0) * (c.reps ?? 0),
                    0
                  )
                : 0),
            0
          )
        );
      }
    }
  }, [exercise.workoutExercises]);

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
    <>
      <TableRow>
        <TableCell>
          <Link to={`/exercises/${exercise.id}`}>{exercise.name}</Link>
        </TableCell>
        <TableCell>
          <span className='font-medium'>{latestWeight} kg</span>
        </TableCell>
        <TableCell>
          {(!!percentageOnPreviousWeight ||
            percentageOnPreviousWeight === 0) && (
            <span className='flex gap-2 items-center'>
              <span
                className={
                  percentageOnPreviousWeight > 0
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
                  percentageOnTarget > 0
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
        <TableCell>PB</TableCell>
        <TableCell align='right'>
          <Button asChild variant='outline'>
            <Link to={`/exercises/${exercise.id}`}>View</Link>
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}
