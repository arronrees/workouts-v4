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

export interface ExerciseMuscleGroup {
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
  notes?: string;
}

export interface WorkoutSet {
  id: string;
  reps?: number;
  time?: number;
  weight?: number;
  distance?: number;
  workoutExerciseId: string;
}

export interface WorkoutExerciseInstance {
  id: string;
  exerciseId: string;
  workoutId: string;
  sortOrder: number;
  exercise: Exercise;
  sets: WorkoutSetInstance[];
  notes?: string;
  wasSkipped: boolean;
}

export interface WorkoutSetInstance {
  id: string;
  reps?: number;
  time?: number;
  weight?: number;
  distance?: number;
  workoutExerciseId: string;
  wasSkipped: boolean;
}

export interface WorkoutInstance {
  id: string;
  createdAt: Date;
  workoutId: string;
  exercises: WorkoutExerciseInstance[];
  workout: {
    name: string;
  };
}
