import { Router } from 'express';
import { WorkoutInstanceController } from '../controllers/workout-instance.controller';
import { validateRecordWorkoutData } from '../validation/workouts';

export const workoutInstanceRouter = Router();

workoutInstanceRouter.post(
  '/:workoutId/record',
  validateRecordWorkoutData,
  WorkoutInstanceController.store
);
