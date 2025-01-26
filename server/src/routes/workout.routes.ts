import { Router } from 'express';
import { validateStoreWorkoutData } from '../validation/workouts';
import { WorkoutController } from '../controllers/workout.controller';

export const workoutRouter = Router();

workoutRouter.get('/', WorkoutController.index);

workoutRouter.get('/:id', WorkoutController.show);

workoutRouter.post('/', validateStoreWorkoutData, WorkoutController.store);
