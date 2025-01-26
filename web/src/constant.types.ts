export interface SessionUser {
  username: string;
  isVerified: boolean;
}

export interface Workout {
  id: string;
  name: string;
  userId: string;
  exercises: WorkoutExercise[];
}

export interface MuscleGroup {
  id: string;
  name: string;
}

interface ExerciseMuscleGroup {
  muscle: MuscleGroup;
}

export interface Exercise {
  id: string;
  name: string;
  measurement:
    | 'time'
    | 'reps_only'
    | 'weight'
    | 'time_or_distance'
    | 'distance';
  equipmentNeeded: 'Full' | 'Basic' | 'None';
  muscles: ExerciseMuscleGroup[];
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  workoutId: string;
  sortOrder: number;
  exercise: Exercise;
  sets: WorkoutSet[];
}

export interface WorkoutSet {
  id: string;
  reps?: number;
  time?: number;
  weight?: number;
  distance?: number;
  workoutExerciseId: string;
}
