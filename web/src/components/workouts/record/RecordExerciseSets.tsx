import { Card, CardContent } from '@/components/ui/shadcn/card';
import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/shadcn/button';
import { v4 as uuidv4 } from 'uuid';
import {
  RecordWorkoutExercise,
  RecordWorkoutSet,
} from '@/pages/workouts/Record';
import RecordExerciseSet from './RecordExerciseSet';

interface Props {
  selection: RecordWorkoutExercise;
  setSelectedExercises: Dispatch<SetStateAction<RecordWorkoutExercise[]>>;
}

export default function RecordExerciseSets({
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
                isDeleted: false,
                targetWeight: 0,
                targetReps: 0,
                targetDistance: 0,
                targetTime: 0,
              },
            ],
          };
        }

        return exercise;
      }),
    ]);
  }

  return (
    <Card className='bg-slate-50'>
      <CardContent className='p-4'>
        <div className='flex flex-col gap-2'>
          {selection.sets && selection.sets.length > 0 ? (
            selection.sets.map(
              (set: RecordWorkoutSet, index: number) =>
                !set.isDeleted && (
                  <RecordExerciseSet
                    key={set.id}
                    set={set}
                    index={index}
                    measurement={selection.exercise.measurement}
                    setSelectedExercises={setSelectedExercises}
                    selection={selection}
                  />
                )
            )
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
