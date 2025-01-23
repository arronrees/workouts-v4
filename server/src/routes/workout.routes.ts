import { Router } from 'express';
import { validateStoreWorkoutData } from '../validation/workouts';
import { WorkoutController } from '../controllers/workout.controller';

export const workoutRouter = Router();

workoutRouter.get('/', WorkoutController.index);

workoutRouter.post('/', validateStoreWorkoutData, WorkoutController.store);
