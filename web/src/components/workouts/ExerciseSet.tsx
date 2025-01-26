import { Input } from '@/components/ui/shadcn/input';
import { Button } from '@/components/ui/shadcn/button';
import { XIcon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { NewWorkoutExercise, NewWorkoutSet } from '@/pages/Workouts/Create';

interface Props {
  measurement:
    | 'time'
    | 'reps_only'
    | 'weight'
    | 'time_or_distance'
    | 'distance';
  index: number;
  setSelectedExercises: Dispatch<SetStateAction<NewWorkoutExercise[]>>;
  selection: NewWorkoutExercise;
  set: NewWorkoutSet;
}

function validateNumber(value: string) {
  if (value && parseFloat(value)) {
    return parseFloat(value);
  }

  return 0;
}

export default function ExerciseSet({
  set,
  measurement,
  index,
  setSelectedExercises,
  selection,
}: Props) {
  function preventScrollOnNumberInputWheel(
    e: React.WheelEvent<HTMLInputElement>
  ) {
    // Prevent the input value change
    (e.target as HTMLInputElement).blur();

    // Prevent the page/container scrolling
    e.stopPropagation();

    // Refocus immediately, on the next tick (after the current function is done)
    setTimeout(() => {
      (e.target as HTMLInputElement).focus();
    }, 0);
  }

  function updateSetReps(reps: string) {
    setSelectedExercises((prev) => [
      ...prev.map((exercise) => {
        if (exercise.id === selection.id) {
          return {
            ...exercise,
            sets: exercise.sets.map((s) => {
              if (s.id !== set.id) return s;

              return {
                ...s,
                reps: validateNumber(reps),
              };
            }),
          };
        }

        return exercise;
      }),
    ]);
  }

  function updateSetWeight(weight: string) {
    setSelectedExercises((prev) => [
      ...prev.map((exercise) => {
        if (exercise.id === selection.id) {
          return {
            ...exercise,
            sets: exercise.sets.map((s) => {
              if (s.id !== set.id) return s;

              return {
                ...s,
                weight: validateNumber(weight),
              };
            }),
          };
        }

        return exercise;
      }),
    ]);
  }

  function updateSetTime(time: string) {
    setSelectedExercises((prev) => [
      ...prev.map((exercise) => {
        if (exercise.id === selection.id) {
          return {
            ...exercise,
            sets: exercise.sets.map((s) => {
              if (s.id !== set.id) return s;

              return {
                ...s,
                time: validateNumber(time),
              };
            }),
          };
        }

        return exercise;
      }),
    ]);
  }

  function updateSetDistance(distance: string) {
    setSelectedExercises((prev) => [
      ...prev.map((exercise) => {
        if (exercise.id === selection.id) {
          return {
            ...exercise,
            sets: exercise.sets.map((s) => {
              if (s.id !== set.id) return s;

              return {
                ...s,
                distance: validateNumber(distance),
              };
            }),
          };
        }

        return exercise;
      }),
    ]);
  }

  function removeSet() {
    setSelectedExercises((prev) => [
      ...prev.map((exercise) => {
        if (exercise.id === selection.id) {
          return {
            ...exercise,
            sets: exercise.sets.filter((s) => s.id !== set.id),
          };
        }

        return exercise;
      }),
    ]);
  }

  return (
    <div>
      <p className='font-semibold mb-1'>Set {index + 1}</p>
      <div className='flex gap-1'>
        {measurement === 'time' && (
          <TimeInput
            updateSetTime={updateSetTime}
            preventScrollOnNumberInputWheel={preventScrollOnNumberInputWheel}
          />
        )}
        {measurement === 'reps_only' && (
          <RepsInput
            updateSetReps={updateSetReps}
            preventScrollOnNumberInputWheel={preventScrollOnNumberInputWheel}
          />
        )}
        {measurement === 'weight' && (
          <WeightInput
            updateSetWeight={updateSetWeight}
            updateSetReps={updateSetReps}
            preventScrollOnNumberInputWheel={preventScrollOnNumberInputWheel}
          />
        )}
        {measurement === 'time_or_distance' && (
          <TimeOrDistanceInput
            updateSetTime={updateSetTime}
            updateSetDistance={updateSetDistance}
            preventScrollOnNumberInputWheel={preventScrollOnNumberInputWheel}
          />
        )}
        {measurement === 'distance' && (
          <DistanceInput
            updateSetDistance={updateSetDistance}
            preventScrollOnNumberInputWheel={preventScrollOnNumberInputWheel}
          />
        )}
        <Button
          variant='ghost'
          className='max-w-max p-2'
          type='button'
          onClick={() => removeSet()}
        >
          <XIcon className='w-3 h-3' />
        </Button>
      </div>
    </div>
  );
}

function TimeInput({
  updateSetTime,
  preventScrollOnNumberInputWheel,
}: {
  updateSetTime: (time: string) => void;
  preventScrollOnNumberInputWheel(e: React.WheelEvent<HTMLInputElement>): void;
}) {
  return (
    <Input
      type='number'
      onWheel={preventScrollOnNumberInputWheel}
      placeholder='Time (minutes)'
      name='time'
      min={0}
      onChange={(e) => {
        updateSetTime(e.target.value);
      }}
      autoFocus
    />
  );
}

function RepsInput({
  updateSetReps,
  preventScrollOnNumberInputWheel,
}: {
  updateSetReps: (reps: string) => void;
  preventScrollOnNumberInputWheel(e: React.WheelEvent<HTMLInputElement>): void;
}) {
  return (
    <Input
      type='number'
      onWheel={preventScrollOnNumberInputWheel}
      placeholder='Reps'
      name='reps'
      min={0}
      onChange={(e) => {
        updateSetReps(e.target.value);
      }}
      autoFocus
    />
  );
}

function WeightInput({
  updateSetWeight,
  updateSetReps,
  preventScrollOnNumberInputWheel,
}: {
  updateSetWeight: (weight: string) => void;
  updateSetReps: (reps: string) => void;
  preventScrollOnNumberInputWheel(e: React.WheelEvent<HTMLInputElement>): void;
}) {
  return (
    <>
      <Input
        type='number'
        onWheel={preventScrollOnNumberInputWheel}
        placeholder='Reps'
        name='reps'
        min={0}
        onChange={(e) => {
          updateSetReps(e.target.value);
        }}
        autoFocus
      />
      <Input
        type='number'
        onWheel={preventScrollOnNumberInputWheel}
        placeholder='Weight (kg)'
        name='weight'
        min={0}
        step={0.5}
        onChange={(e) => {
          updateSetWeight(e.target.value);
        }}
      />
    </>
  );
}

function TimeOrDistanceInput({
  updateSetTime,
  updateSetDistance,
  preventScrollOnNumberInputWheel,
}: {
  updateSetTime: (time: string) => void;
  updateSetDistance: (distance: string) => void;
  preventScrollOnNumberInputWheel(e: React.WheelEvent<HTMLInputElement>): void;
}) {
  return (
    <>
      <Input
        type='number'
        onWheel={preventScrollOnNumberInputWheel}
        placeholder='Distance (meters)?'
        name='distance'
        min={0}
        onChange={(e) => {
          updateSetDistance(e.target.value);
        }}
        autoFocus
      />
      <Input
        type='number'
        onWheel={preventScrollOnNumberInputWheel}
        placeholder='Time (minutes)?'
        name='time'
        min={0}
        step={0.5}
        onChange={(e) => {
          updateSetTime(e.target.value);
        }}
      />
    </>
  );
}

function DistanceInput({
  updateSetDistance,
  preventScrollOnNumberInputWheel,
}: {
  updateSetDistance: (distance: string) => void;
  preventScrollOnNumberInputWheel(e: React.WheelEvent<HTMLInputElement>): void;
}) {
  return (
    <Input
      type='number'
      onWheel={preventScrollOnNumberInputWheel}
      placeholder='Distance (meters)'
      name='distance'
      min={0}
      onChange={(e) => {
        updateSetDistance(e.target.value);
      }}
      autoFocus
    />
  );
}
