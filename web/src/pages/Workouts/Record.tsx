import {
  ActionFunctionArgs,
  Form,
  redirect,
  useParams,
} from 'react-router-dom';
import { API_URL, getUser } from '../../constants';
import UserLayout from '../../layouts/Layout';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/shadcn/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import PageStructure from '@/components/ui/PageStructure';
import { Button } from '@/components/ui/shadcn/button';
import axios, { AxiosError } from 'axios';
import { Exercise, Workout } from '@/constant.types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import RecordExerciseCard from '@/components/workouts/record/RecordExerciseCard';

export async function loader() {
  const user = await getUser();

  if (!user) {
    return redirect('/signin');
  }

  return {};
}

export interface RecordWorkoutSet {
  id: string;
  reps?: number | null;
  weight?: number | null;
  distance?: number | null;
  time?: number | null;
  setId?: string;
  isDeleted: boolean;
  targetReps?: number | null;
  targetDistance?: number | null;
  targetWeight?: number | null;
  targetTime?: number | null;
}

export interface RecordWorkoutExercise {
  id: string;
  exercise: Exercise;
  workoutExerciseId: string;
  isDeleted: boolean;
  sortOrder: number;
  sets: RecordWorkoutSet[];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = formData.get('workout_data') as string,
    id = formData.get('workout_id');

  if (!id || !data) {
    return null;
  }

  try {
    await axios.post(
      `${API_URL}/api/workouts/history/${id}`,
      {
        exercises: JSON.parse(data),
      },
      { withCredentials: true }
    );

    return redirect(`/workouts/${id}`);
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log(err.response?.data?.error);

      return err.response?.data?.error
        ? err.response?.data?.error
        : 'Could not record workout, please try again.';
    }

    return null;
  }
}

export default function RecordWorkout() {
  const { id } = useParams();

  const [selectedExercises, setSelectedExercises] = useState<
    RecordWorkoutExercise[]
  >([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);

  function removeSelectedExercise(removedExercise: Exercise) {
    setSelectedExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.exercise.id === removedExercise.id) {
          return {
            ...exercise,
            isDeleted: true,
          };
        }

        return exercise;
      })
    );
    setAvailableExercises((prev) => [...prev, removedExercise]);
  }

  const { data, isError, error } = useQuery({
    queryKey: ['workout', id],
    queryFn: (): Promise<{ success: boolean; data: Workout }> =>
      axios
        .get(`${API_URL}/api/workouts/${id}`, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });

  useEffect(() => {
    if (data?.data) {
      setSelectedExercises(
        data.data.exercises.map((exercise) => ({
          id: exercise.id,
          isDeleted: false,
          workoutExerciseId: exercise.id,
          exercise: exercise.exercise,
          sortOrder: exercise.sortOrder,
          sets: exercise.sets.map((set) => ({
            ...set,
            isDeleted: false,
            setId: set.id,
            reps: set.reps ? 0 : null,
            targetReps: set.reps,
            distance: set.distance ? 0 : null,
            targetDistance: set.distance,
            weight: set.weight ? 0 : null,
            targetWeight: set.weight,
            time: set.time ? 0 : null,
            targetTime: set.time,
          })),
        }))
      );
    }
  }, [data]);

  useEffect(() => {
    if (data?.data && availableExercises.length > 0) {
      setAvailableExercises((prev) => [
        ...prev.filter(
          (ex) =>
            !data.data.exercises
              .map((exercise) => exercise.exercise.id)
              .find((id) => id === ex.id)
        ),
      ]);
    }
  }, [data, availableExercises.length]);

  if (isError) {
    console.log(error?.message);

    return (
      <p className='error__style'>
        There was an error fetching the workout, please try again.
      </p>
    );
  }

  return (
    <UserLayout>
      <PageStructure>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/dashboard'>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href='/workouts'>Workouts</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/workouts/${id}`}>
                {data?.data.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Record</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Form method='POST' className='flex flex-1 flex-col gap-4 lg:gap-6'>
          <input type='hidden' name='workout_id' value={id} />
          <input
            type='hidden'
            name='workout_data'
            value={JSON.stringify(
              selectedExercises.map((exercise) => ({
                id: exercise.exercise.id,
                workoutExerciseId: exercise.workoutExerciseId,
                isDeleted: exercise.isDeleted,
                sortOrder: exercise.sortOrder,
                sets: exercise.sets.map((set) => ({
                  reps: set.reps ?? null,
                  time: set.time ?? null,
                  weight: set.weight ?? null,
                  distance: set.distance ?? null,
                  setId: set.setId,
                  isDeleted: set.isDeleted,
                })),
              }))
            )}
          />
          <Card>
            <CardHeader>
              <CardTitle>Record {data?.data.name}</CardTitle>
              <CardDescription>Record your workout</CardDescription>
            </CardHeader>
          </Card>
          {selectedExercises.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sets & Reps</CardTitle>
                <CardDescription>
                  Add the sets and reps you have completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col gap-4'>
                  {selectedExercises &&
                    selectedExercises.length > 0 &&
                    selectedExercises
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map(
                        (selection) =>
                          !selection.isDeleted && (
                            <RecordExerciseCard
                              key={selection.id}
                              selection={selection}
                              removeSelectedExercise={removeSelectedExercise}
                              setSelectedExercises={setSelectedExercises}
                              selectedExercises={selectedExercises}
                            />
                          )
                      )}
                </div>
              </CardContent>
              <CardFooter className='flex items-center justify-end'>
                <Button type='submit'>Complete Workout</Button>
              </CardFooter>
            </Card>
          )}
        </Form>
      </PageStructure>
    </UserLayout>
  );
}
