import { useEffect, useMemo, useState } from 'react';
import { Exercise } from '../../constant.types';

export default function AddExerciseModal({
  exercises,
  closeModal,
  addExerciseToWorkout,
}: {
  exercises: Exercise[];
  closeModal: () => void;
  addExerciseToWorkout: (id: string, name: string) => void;
}) {
  const originalExercises = useMemo(() => exercises, [closeModal]);

  console.log(originalExercises);

  function makeExerciseUnavailable(id: string) {
    if (availableExercises) {
      setAvailableExercises(
        availableExercises.filter((exercise) => exercise.id !== id)
      );
    }
  }

  const [availableExercises, setAvailableExercises] = useState<
    Exercise[] | null
  >(null);

  useEffect(() => {
    if (exercises) {
      setAvailableExercises(exercises);
    }
  }, [exercises]);

  return (
    <section className='px-6 py-8  fixed z-50 w-screen h-screen top-0 left-0'>
      <button
        type='button'
        onClick={closeModal}
        className='flex p-2 items-center justify-center absolute top-4 right-4'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M6 18 18 6M6 6l12 12'
          />
        </svg>
      </button>
      <div>
        <p className='text-xl md:text-2xl font-semibold mb-4 uppercase tracking-wider'>
          Select Exercises
        </p>
      </div>
      <div className='mt-4 space-y-4'>
        {availableExercises &&
          availableExercises.map((exercise) => (
            <div
              key={exercise.id}
              className='border-2 p-4 flex gap-4 justify-between items-center'
            >
              <div>
                <p>{exercise.name}</p>
                <div className='flex gap-4 items-center mt-2'>
                  <p className=' text-xs flex gap-2 items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='w-4'
                    >
                      <path d='M14.4 14.4 9.6 9.6' />
                      <path d='M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z' />
                      <path d='m21.5 21.5-1.4-1.4' />
                      <path d='M3.9 3.9 2.5 2.5' />
                      <path d='M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z' />
                    </svg>
                    {exercise.equipmentNeeded}
                  </p>
                </div>
              </div>
              <div>
                <button
                  type='button'
                  onClick={() => {
                    addExerciseToWorkout(exercise.id, exercise.name);
                    makeExerciseUnavailable(exercise.id);
                  }}
                >
                  Add
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 4.5v15m7.5-7.5h-15'
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
