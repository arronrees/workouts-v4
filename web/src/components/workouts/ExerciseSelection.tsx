import { ChevronsUpDown } from 'lucide-react';
import { Button } from '../ui/shadcn/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/shadcn/popover';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandItem,
} from '../ui/shadcn/command';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { API_URL } from '@/constants';
import { Exercise, MuscleGroup } from '@/constant.types';
import { Skeleton } from '../ui/shadcn/skeleton';
import useAxios from '@/hooks/useAxios';
import { NewWorkoutExercise } from '@/pages/Workouts/Create';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  setSelectedExercises: Dispatch<SetStateAction<NewWorkoutExercise[]>>;
  setAvailableExercises: Dispatch<SetStateAction<Exercise[]>>;
  availableExercises: Exercise[];
}

export default function ExerciseSelection({
  setSelectedExercises,
  availableExercises,
  setAvailableExercises,
}: Props) {
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [open, setOpen] = useState(false);

  const {
    isLoading: isMuscleGroupDataLoading,
    data: muscleGroupData,
    error: muscleGroupDataError,
  } = useAxios<MuscleGroup[]>({
    url: `${API_URL}/api/muscle-groups`,
    method: 'get',
  });

  const {
    isLoading: isExerciseDataLoading,
    data: exerciseData,
    error: exerciseDataError,
  } = useAxios<Exercise[]>({
    url: `${API_URL}/api/exercises`,
    method: 'get',
  });

  useEffect(() => {
    if (exerciseData?.data) {
      setAvailableExercises(exerciseData.data);
    }
    if (muscleGroupData?.data) {
      setMuscleGroups(muscleGroupData.data);
    }
  }, [exerciseData, muscleGroupData, setAvailableExercises, setMuscleGroups]);

  if (isMuscleGroupDataLoading || isExerciseDataLoading) {
    return <Skeleton className='h-10 w-full' />;
  }
  if (muscleGroupDataError || exerciseDataError) {
    console.log(muscleGroupDataError);
    console.log(exerciseDataError);
    return (
      <p className='text-red-500 text-sm font-light'>
        There was an error fetching your workouts, please try again.
      </p>
    );
  }

  function addExercise(exercise: Exercise) {
    setSelectedExercises((prev) => [
      ...prev,
      {
        exercise,
        id: uuidv4(),
        sortOrder: (() => {
          if (prev && prev.length > 0) {
            return prev[prev.length - 1].sortOrder + 1;
          }

          return 0;
        })(),
        sets: [],
      },
    ]);
  }

  function removeExerciseFromList(exerciseId: string) {
    setAvailableExercises((prev) =>
      prev.filter((exercise) => exercise.id !== exerciseId)
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='justify-between w-full max-w-full'
        >
          Select exercises...
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0 w-full PopoverContent'>
        <Command>
          <CommandInput placeholder='Search exercises...' />
          <CommandEmpty>No exercises found.</CommandEmpty>
          <CommandList>
            {muscleGroups.map((group) => (
              <CommandGroup heading={group.name} key={group.id}>
                {availableExercises &&
                  availableExercises
                    .filter((exercise) => {
                      return exercise.muscles.some(
                        (muscle) => muscle.muscle.id === group.id
                      );
                    })
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((exercise) => (
                      <CommandItem
                        key={exercise.id}
                        value={exercise.name}
                        onSelect={() => {
                          addExercise(exercise);
                          removeExerciseFromList(exercise.id);
                        }}
                      >
                        {exercise.name}
                      </CommandItem>
                    ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
