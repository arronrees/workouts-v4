import { Router } from 'express';
import { WorkoutHistoryController } from '../controllers/workout-history.controller';
import { validateRecordWorkoutData } from '../validation/workouts';

export const workoutHistoryRouter = Router();

workoutHistoryRouter.get('/', WorkoutHistoryController.all);

workoutHistoryRouter.get('/:workoutId', WorkoutHistoryController.index);

workoutHistoryRouter.get(
  '/totals/weight',
  WorkoutHistoryController.totalWeight
);

workoutHistoryRouter.get('/totals/sets', WorkoutHistoryController.totalSets);

workoutHistoryRouter.get('/totals/reps', WorkoutHistoryController.totalReps);

workoutHistoryRouter.get(
  '/:workoutId/:instanceId',
  WorkoutHistoryController.show
);

workoutHistoryRouter.post(
  '/:workoutId',
  validateRecordWorkoutData,
  WorkoutHistoryController.store
);
