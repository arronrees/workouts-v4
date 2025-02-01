import { Router } from 'express';
import { WorkoutHistoryController } from '../controllers/workout-history.controller';
import { validateRecordWorkoutData } from '../validation/workouts';

export const workoutHistoryRouter = Router();

workoutHistoryRouter.get('/:workoutId', WorkoutHistoryController.index);

workoutHistoryRouter.get(
  '/:workoutId/:instanceId',
  WorkoutHistoryController.show
);

workoutHistoryRouter.post(
  '/:workoutId',
  validateRecordWorkoutData,
  WorkoutHistoryController.store
);
