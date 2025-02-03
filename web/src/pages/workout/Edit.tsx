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
import { Label } from '@/components/ui/shadcn/label';
import { Input } from '@/components/ui/shadcn/input';
import { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
import { Badge } from '@/components/ui/shadcn/badge';
import EditExerciseSelection from '@/components/workouts/edit/EditExerciseSelection';
import EditExerciseCard from '@/components/workouts/edit/EditExerciseCard';

export async function loader() {
  const user = await getUser();

  if (!user) {
    return redirect('/signin');
  }

  return {};
}

export interface EditWorkoutSet {
  id: string;
  reps?: number;
  weight?: number;
  distance?: number;
  time?: number;
  setId?: string;
  isDeleted: boolean;
}

export interface EditWorkoutExercise {
  id: string;
  exercise: Exercise;
  workoutExerciseId?: string;
  isDeleted: boolean;
  sortOrder: number;
  sets: EditWorkoutSet[];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get('workout_name'),
    data = formData.get('workout_data') as string,
    id = formData.get('workout_id');

  if (!id || !data) {
    return null;
  }

  try {
    await axios.put(
      `${API_URL}/api/workouts/${id}`,
      {
        name,
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
        : 'Could not update workout, please try again.';
    }

    return null;
  }
}

export default function EditWorkout() {
  const { id } = useParams();

  const [selectedExercises, setSelectedExercises] = useState<
    EditWorkoutExercise[]
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
              <BreadcrumbPage>Edit</BreadcrumbPage>
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
                workoutExerciseId: exercise.workoutExerciseId ?? null,
                isDeleted: exercise.isDeleted,
                sortOrder: exercise.sortOrder,
                sets: exercise.sets.map((set) => ({
                  reps: set.reps ?? null,
                  time: set.time ?? null,
                  weight: set.weight ?? null,
                  distance: set.distance ?? null,
                  setId: set.setId ?? null,
                  isDeleted: set.isDeleted,
                })),
              }))
            )}
          />
          <Card>
            <CardHeader>
              <CardTitle>Edit {data?.data.name}</CardTitle>
              <CardDescription>
                Edit your excerises and update your workout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='workout_name'>Workout Name</Label>
                  <div className='mt-2'>
                    <Input
                      id='workout_name'
                      name='workout_name'
                      type='text'
                      required
                      defaultValue={data?.data.name}
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  {selectedExercises.length > 0 && (
                    <div className='flex flex-wrap gap-2 mb-2'>
                      {selectedExercises.map(
                        (exercise) =>
                          !exercise.isDeleted && (
                            <Badge
                              key={exercise.exercise.id}
                              variant='secondary'
                              className='flex gap-1 cursor-pointer'
                              onClick={() =>
                                removeSelectedExercise(exercise.exercise)
                              }
                            >
                              {exercise.exercise.name}
                              <XIcon className='w-3 h-3' />
                            </Badge>
                          )
                      )}
                    </div>
                  )}
                  <EditExerciseSelection
                    availableExercises={availableExercises}
                    setAvailableExercises={setAvailableExercises}
                    setSelectedExercises={setSelectedExercises}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          {selectedExercises.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sets & Reps</CardTitle>
                <CardDescription>
                  Add target sets and reps for each exercise you have selected.
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
                            <EditExerciseCard
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
                <Button type='submit'>Update</Button>
              </CardFooter>
            </Card>
          )}
        </Form>
      </PageStructure>
    </UserLayout>
  );
}
