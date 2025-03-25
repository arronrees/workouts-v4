import { Input } from '@/components/ui/shadcn/input';
import { Button } from '@/components/ui/shadcn/button';
import { XIcon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { Label } from '../../ui/shadcn/label';
import { EditWorkoutExercise, EditWorkoutSet } from '@/pages/workouts/Edit';

interface Props {
  measurement:
    | 'time'
    | 'reps_only'
    | 'weight'
    | 'time_or_distance'
    | 'distance';
  index: number;
  setSelectedExercises: Dispatch<SetStateAction<EditWorkoutExercise[]>>;
  selection: EditWorkoutExercise;
  set: EditWorkoutSet;
}

function validateNumber(value: string) {
  if (value && parseFloat(value)) {
    return parseFloat(value);
  }

  return 0;
}

export default function EditExerciseSet({
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
            sets: exercise.sets.map((s: EditWorkoutSet) => {
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
            sets: exercise.sets.map((s: EditWorkoutSet) => {
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
            sets: exercise.sets.map((s: EditWorkoutSet) => {
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
            sets: exercise.sets.map((s: EditWorkoutSet) => {
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
            sets: exercise.sets.map((s: EditWorkoutSet) => {
              if (s.id === set.id) {
                return { ...s, isDeleted: true };
              }

              return s;
            }),
          };
        }

        return exercise;
      }),
    ]);
  }

  return (
    <div>
      <p className='font-semibold mb-1'>Set {index + 1}</p>
      <div className='flex gap-1 items-end'>
        {measurement === 'time' && (
          <TimeInput
            updateSetTime={updateSetTime}
            preventScrollOnNumberInputWheel={preventScrollOnNumberInputWheel}
            time={set.time}
          />
        )}
        {measurement === 'reps_only' && (
          <RepsInput
            updateSetReps={updateSetReps}
            preventScrollOnNumberInputWheel={preventScrollOnNumberInputWheel}
            reps={set.reps}
          />
        )}
        {measurement === 'weight' && (
          <WeightInput
            updateSetWeight={updateSetWeight}
            updateSetReps={updateSetReps}
            preventScrollOnNumberInputWheel={preventScrollOnNumberInputWheel}
            weight={set.weight}
            reps={set.reps}
          />
        )}
        {measurement === 'time_or_distance' && (
          <TimeOrDistanceInput
            updateSetTime={updateSetTime}
            updateSetDistance={updateSetDistance}
            preventScrollOnNumberInputWheel={preventScrollOnNumberInputWheel}
            distance={set.distance}
            time={set.time}
          />
        )}
        {measurement === 'distance' && (
          <DistanceInput
            updateSetDistance={updateSetDistance}
            preventScrollOnNumberInputWheel={preventScrollOnNumberInputWheel}
            distance={set.distance}
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
  time,
}: {
  updateSetTime: (time: string) => void;
  preventScrollOnNumberInputWheel(e: React.WheelEvent<HTMLInputElement>): void;
  time?: number | string;
}) {
  return (
    <div className='flex flex-col gap-1 w-full'>
      <Label htmlFor='time'>Time</Label>
      <Input
        type='number'
        onWheel={preventScrollOnNumberInputWheel}
        placeholder='Time (minutes)'
        name='time'
        min={0}
        step={0.1}
        defaultValue={time}
        onChange={(e) => {
          updateSetTime(e.target.value);
        }}
        autoFocus
      />
    </div>
  );
}

function RepsInput({
  updateSetReps,
  preventScrollOnNumberInputWheel,
  reps,
}: {
  updateSetReps: (reps: string) => void;
  preventScrollOnNumberInputWheel(e: React.WheelEvent<HTMLInputElement>): void;
  reps?: number | string;
}) {
  return (
    <div className='flex flex-col gap-1 w-full'>
      <Label htmlFor='reps'>Reps</Label>
      <Input
        type='number'
        onWheel={preventScrollOnNumberInputWheel}
        placeholder='Reps'
        name='reps'
        min={0}
        step={0.1}
        defaultValue={reps}
        onChange={(e) => {
          updateSetReps(e.target.value);
        }}
        autoFocus
      />
    </div>
  );
}

function WeightInput({
  updateSetWeight,
  updateSetReps,
  preventScrollOnNumberInputWheel,
  reps,
  weight,
}: {
  updateSetWeight: (weight: string) => void;
  updateSetReps: (reps: string) => void;
  preventScrollOnNumberInputWheel(e: React.WheelEvent<HTMLInputElement>): void;
  reps?: number | string;
  weight?: number | string;
}) {
  return (
    <>
      <div className='flex flex-col gap-1 w-full'>
        <Label className='text-muted-foreground text-xs'>Reps</Label>
        <Input
          type='number'
          onWheel={preventScrollOnNumberInputWheel}
          placeholder='Reps'
          name='reps'
          step={0.1}
          min={0}
          defaultValue={reps}
          onChange={(e) => {
            updateSetReps(e.target.value);
          }}
          autoFocus
        />
      </div>
      <div className='flex flex-col gap-1 w-full'>
        <Label className='text-muted-foreground text-xs'>Weight (kg)</Label>
        <Input
          type='number'
          onWheel={preventScrollOnNumberInputWheel}
          placeholder='Weight (kg)'
          name='weight'
          step={0.1}
          min={0}
          defaultValue={weight}
          onChange={(e) => {
            updateSetWeight(e.target.value);
          }}
        />
      </div>
    </>
  );
}

function TimeOrDistanceInput({
  updateSetTime,
  updateSetDistance,
  preventScrollOnNumberInputWheel,
  distance,
  time,
}: {
  updateSetTime: (time: string) => void;
  updateSetDistance: (distance: string) => void;
  preventScrollOnNumberInputWheel(e: React.WheelEvent<HTMLInputElement>): void;
  distance?: number | string;
  time?: number | string;
}) {
  return (
    <>
      <div className='flex flex-col gap-1 w-full'>
        <Label className='text-muted-foreground text-xs'>
          Distance (meters)
        </Label>
        <Input
          type='number'
          onWheel={preventScrollOnNumberInputWheel}
          placeholder='Distance (meters)?'
          name='distance'
          min={0}
          step={0.1}
          defaultValue={distance}
          onChange={(e) => {
            updateSetDistance(e.target.value);
          }}
          autoFocus
        />
      </div>
      <div className='flex flex-col gap-1 w-full'>
        <Label className='text-muted-foreground text-xs'>Time (minutes)</Label>
        <Input
          type='number'
          onWheel={preventScrollOnNumberInputWheel}
          placeholder='Time (minutes)?'
          name='time'
          step={0.1}
          defaultValue={time}
          min={0}
          onChange={(e) => {
            updateSetTime(e.target.value);
          }}
        />
      </div>
    </>
  );
}

function DistanceInput({
  updateSetDistance,
  preventScrollOnNumberInputWheel,
  distance,
}: {
  updateSetDistance: (distance: string) => void;
  preventScrollOnNumberInputWheel(e: React.WheelEvent<HTMLInputElement>): void;
  distance?: number | string;
}) {
  return (
    <div className='flex flex-col gap-1 w-full'>
      <Label className='text-muted-foreground text-xs'>Distance (meters)</Label>
      <Input
        type='number'
        onWheel={preventScrollOnNumberInputWheel}
        placeholder='Distance (meters)'
        name='distance'
        min={0}
        step={0.1}
        defaultValue={distance}
        onChange={(e) => {
          updateSetDistance(e.target.value);
        }}
        autoFocus
      />
    </div>
  );
}
