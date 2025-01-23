import { Form, redirect } from 'react-router-dom';
import { API_URL, getUser } from '../../constants';
import UserLayout from '../../layouts/Layout';
import { useQuery } from '@tanstack/react-query';
import { Exercise } from '../../constant.types';
import axios from 'axios';
import { ScaleLoader } from 'react-spinners';
import { useState } from 'react';
import AddExerciseModal from '../../components/workouts/AddExerciseModal';
import useAxios from '../../hooks/useAxios';

export async function loader() {
  const user = await getUser();

  if (!user) {
    return redirect('/signin');
  }

  return {};
}

interface NewWorkout {
  name: string;
  exercises: NewWorkoutExercise[];
}

interface NewWorkoutExercise {
  exerciseId: string;
  sortOrder: number;
  name: string;
  sets: NewWorkoutSet[];
}

interface NewWorkoutSet {
  reps?: number;
  time?: number;
  weight?: number;
}

export default function CreateWorkout() {
  const { isLoading, error, data } = useAxios<Exercise[]>({
    method: 'GET',
    url: `${API_URL}/api/exercises`,
    withCredentials: true,
  });

  console.log(data);

  const [newWorkout, setNewWorkout] = useState<NewWorkout>({
    name: '',
    exercises: [],
  });

  const [isSelectingExercises, setIsSelectingExercises] =
    useState<boolean>(false);

  function openModal() {
    setIsSelectingExercises(true);
  }

  function closeModal() {
    setIsSelectingExercises(false);
  }

  function addExerciseToWorkout(id: string, name: string) {
    setNewWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          exerciseId: id,
          sets: [],
          sortOrder: prev.exercises.length + 1,
          name,
        },
      ],
    }));
  }

  if (isLoading) {
    return (
      <UserLayout>
        <div className='p-6 flex items-center justify-center'>
          <ScaleLoader color='#A3DCA1' height={32} />
        </div>
      </UserLayout>
    );
  }

  if (error) {
    console.log(error);

    return (
      <UserLayout>
        <p className='bg-red-200 text-sm p-4'>
          There was an error fetching exercises, please try again.
        </p>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className=''>
        <h1 className='text-xl md:text-2xl font-semibold mb-4 uppercase tracking-wider'>
          Create Workout
        </h1>
        <div>
          <div className='card md:col-span-3'>
            <Form method='POST' className='space-y-4'>
              <div>
                <label htmlFor='workout_name' className='form__label'>
                  Workout Name
                </label>
                <div className='mt-2'>
                  <input
                    id='workout_name'
                    name='workout_name'
                    type='text'
                    required
                    className='form__input'
                  />
                </div>
              </div>

              <div>
                <div className='mt-2'>
                  <button type='button' onClick={openModal}>
                    Select Exercises
                  </button>
                </div>
                {/* {isSelectingExercises && data?.data && (
                  <AddExerciseModal
                    exercises={data.data}
                    closeModal={closeModal}
                    addExerciseToWorkout={addExerciseToWorkout}
                  />
                )} */}
                {data?.data?.map((exercise) => (
                  <p>{exercise.name}</p>
                ))}
              </div>
            </Form>

            {newWorkout && <pre>{JSON.stringify(newWorkout)}</pre>}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
