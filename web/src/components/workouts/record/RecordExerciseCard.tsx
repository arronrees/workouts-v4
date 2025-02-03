import { Button } from '@/components/ui/shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import { ChevronDown, ChevronUp, XIcon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { Exercise } from '@/constant.types';
import { RecordWorkoutExercise } from '@/pages/workout/Record';
import RecordExerciseSets from './RecordExerciseSets';

interface Props {
  selection: RecordWorkoutExercise;
  removeSelectedExercise: (exercise: Exercise) => void;
  setSelectedExercises: Dispatch<SetStateAction<RecordWorkoutExercise[]>>;
  selectedExercises: RecordWorkoutExercise[];
}

export default function RecordExerciseCard({
  selection,
  removeSelectedExercise,
  setSelectedExercises,
  selectedExercises,
}: Props) {
  function reSortExercises(id: string, sortFrom: number, sortTo: number) {
    setSelectedExercises((prev) =>
      prev.map((exercise) => {
        // if already on lowest or highest position, return the same
        if (sortTo < 0 || sortTo >= prev.length) {
          return exercise;
        }

        // change the sort order of the clicked exercise
        if (exercise.id === id) {
          return {
            ...exercise,
            sortOrder: sortTo,
          };
        }

        // change the sort order of the exercise that was swapped with the clicked exercise
        if (exercise.sortOrder === sortTo) {
          return {
            ...exercise,
            sortOrder: sortFrom,
          };
        }

        return exercise;
      })
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex gap-2 justify-between items-end'>
          <div>
            <CardTitle className='text-sm'>{selection.exercise.name}</CardTitle>
            <CardDescription className='text-xs'>
              Add sets and reps
            </CardDescription>
          </div>
          <div className='flex gap-1'>
            {selection.sortOrder > 0 && (
              <Button
                variant='outline'
                className='max-w-max h-max p-2'
                type='button'
                onClick={() => {
                  reSortExercises(
                    selection.id,
                    selection.sortOrder,
                    selection.sortOrder - 1
                  );
                }}
              >
                <ChevronUp className='w-3 h-3' />
              </Button>
            )}
            {selection.sortOrder !== selectedExercises.length - 1 && (
              <Button
                variant='outline'
                className='max-w-max h-max p-2'
                type='button'
                onClick={() => {
                  reSortExercises(
                    selection.id,
                    selection.sortOrder,
                    selection.sortOrder + 1
                  );
                }}
              >
                <ChevronDown className='w-3 h-3' />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <RecordExerciseSets
          selection={selection}
          setSelectedExercises={setSelectedExercises}
        />
      </CardContent>
      <CardFooter>
        <Button
          variant='ghost'
          type='button'
          onClick={() => {
            removeSelectedExercise(selection.exercise);
          }}
          className='flex gap-2 items-center ml-auto p-2 h-auto text-xs'
        >
          Remove Exercise
          <XIcon className='w-3 h-3' />
        </Button>
      </CardFooter>
    </Card>
  );
}
