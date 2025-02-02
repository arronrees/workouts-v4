import { Router } from 'express';
import { WorkoutExerciseController } from '../controllers/workout-exercise.controller';

export const workoutExerciseRouter = Router();

workoutExerciseRouter.get('/', WorkoutExerciseController.index);

workoutExerciseRouter.get('/:id', WorkoutExerciseController.show);
