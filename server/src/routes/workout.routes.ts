import { Router } from 'express';
import { createNewWorkoutController } from '../controllers/workout.controller';
import { checkWorkoutObjectValid } from '../validation/workouts';

export const workoutRouter = Router();

workoutRouter.post('/', checkWorkoutObjectValid, createNewWorkoutController);
