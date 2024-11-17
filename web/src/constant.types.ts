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

export interface Exercise {
  id: string;
  name: string;
  measurement: 'time' | 'reps' | 'weight';
  equipmentNeeded: string;
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
  workoutExerciseId: string;
}
