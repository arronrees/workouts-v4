import { Card, CardContent } from '@/components/ui/shadcn/card';
import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/shadcn/button';
import { v4 as uuidv4 } from 'uuid';
import ExerciseSet from './ExerciseSet';
import { NewWorkoutExercise, NewWorkoutSet } from '@/pages/workout/Create';

interface Props {
  selection: NewWorkoutExercise;
  setSelectedExercises: Dispatch<SetStateAction<NewWorkoutExercise[]>>;
}

export default function ExerciseSets({
  selection,
  setSelectedExercises,
}: Props) {
  function addSet() {
    setSelectedExercises((prev) => [
      ...prev.map((exercise) => {
        if (exercise.id === selection.id) {
          return {
            ...exercise,
            sets: [
              ...exercise.sets,
              {
                id: uuidv4(),
              },
            ],
          };
        }

        return exercise;
      }),
    ]);
  }

  return (
    <Card className='bg-slate-50/60'>
      <CardContent className='p-4'>
        <div className='flex flex-col gap-2'>
          {selection.sets && selection.sets.length > 0 ? (
            selection.sets.map((set: NewWorkoutSet, index: number) => (
              <ExerciseSet
                key={set.id}
                set={set}
                index={index}
                measurement={selection.exercise.measurement}
                setSelectedExercises={setSelectedExercises}
                selection={selection}
              />
            ))
          ) : (
            <p className='font-medium text-muted-foreground text-sm'>
              No sets created
            </p>
          )}
          <Button
            variant='ghost'
            className='max-w-max'
            type='button'
            onClick={addSet}
          >
            Add Set
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
