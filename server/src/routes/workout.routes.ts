import { Router } from 'express';
import {
  getAllUserWorkouts,
  createNewWorkoutController,
} from '../controllers/workout.controller';
import { checkWorkoutObjectValid } from '../validation/workouts';

export const workoutRouter = Router();

workoutRouter.get('/', getAllUserWorkouts);

workoutRouter.post('/', checkWorkoutObjectValid, createNewWorkoutController);
