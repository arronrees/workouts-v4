import { ActionFunctionArgs, Form, redirect } from 'react-router-dom';
import { API_URL, getUser } from '../../constants';
import UserLayout from '../../layouts/Layout';
import PageStructure from '@/components/ui/PageStructure';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/shadcn/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import ExerciseSelection from '@/components/workouts/ExerciseSelection';
import { useState } from 'react';
import { Exercise } from '@/constant.types';
import { Badge } from '@/components/ui/shadcn/badge';
import { XIcon } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import ExerciseCard from '@/components/workouts/ExerciseCard';

export async function loader() {
  const user = await getUser();

  if (!user) {
    return redirect('/signin');
  }

  return {};
}

export interface NewWorkoutSet {
  id: string;
  reps?: number;
  weight?: number;
  distance?: number;
  time?: number;
}

export interface NewWorkoutExercise {
  exercise: Exercise;
  sortOrder: number;
  id: string;
  sets: NewWorkoutSet[];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get('workout_name'),
    data = formData.get('workout_data') as string;

  try {
    await axios.post(
      `${API_URL}/api/workouts`,
      {
        name,
        exercises: JSON.parse(data),
      },
      { withCredentials: true }
    );

    return redirect('/workouts');
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log(err.response?.data?.error);

      return err.response?.data?.error
        ? err.response?.data?.error
        : 'Could not create workout, please try again.';
    }

    return null;
  }
}

export default function CreateWorkout() {
  const [selectedExercises, setSelectedExercises] = useState<
    NewWorkoutExercise[]
  >([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);

  function removeSelectedExercise(removedExercise: Exercise) {
    setSelectedExercises((prev) =>
      prev.filter((exercise) => exercise.exercise.id !== removedExercise.id)
    );
    setAvailableExercises((prev) => [...prev, removedExercise]);
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
              <BreadcrumbPage>Create</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Form method='POST' className='flex flex-1 flex-col gap-4 lg:gap-6'>
          <input
            type='hidden'
            name='workout_data'
            value={JSON.stringify(
              selectedExercises.map((exercise) => ({
                id: exercise.exercise.id,
                sortOrder: exercise.sortOrder,
                sets: exercise.sets.map((set, index) => ({
                  reps: set.reps ?? null,
                  time: set.time ?? null,
                  weight: set.weight ?? null,
                  distance: set.distance ?? null,
                  sortOrder: index,
                })),
              }))
            )}
          />
          <Card>
            <CardHeader>
              <CardTitle>Create Workout</CardTitle>
              <CardDescription>
                Add your excerises and create your workout
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
                    />
                  </div>
                </div>

                <div>
                  {selectedExercises.length > 0 && (
                    <div className='flex flex-wrap gap-2 mb-2'>
                      {selectedExercises.map((exercise) => (
                        <Badge
                          variant='secondary'
                          key={exercise.exercise.id}
                          className='flex gap-1 cursor-pointer'
                          onClick={() =>
                            removeSelectedExercise(exercise.exercise)
                          }
                        >
                          {exercise.exercise.name}
                          <XIcon className='w-3 h-3' />
                        </Badge>
                      ))}
                    </div>
                  )}
                  <ExerciseSelection
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
                      .map((selection) => (
                        <ExerciseCard
                          key={selection.id}
                          selection={selection}
                          removeSelectedExercise={removeSelectedExercise}
                          setSelectedExercises={setSelectedExercises}
                          selectedExercises={selectedExercises}
                        />
                      ))}
                </div>
              </CardContent>
              <CardFooter className='flex items-center justify-end'>
                <Button type='submit'>Create</Button>
              </CardFooter>
            </Card>
          )}
        </Form>
      </PageStructure>
    </UserLayout>
  );
}
