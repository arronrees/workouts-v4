import { Request, Response, NextFunction } from 'express';
import { JsonApiResponse, AuthLocals } from '../constant.types';
import { db } from '../db/db';
import { RecordWorkoutType } from '../validation/workouts';

async function store(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  try {
    const { workoutId } = req.params;
    const { body: workoutData }: { body: RecordWorkoutType } = req;

    const workout = await db.workout.findUnique({ where: { id: workoutId } });

    if (!workout) {
      return res
        .status(404)
        .json({ success: false, data: 'Workout not found' });
    }

    const newWorkoutInstance = await db.workoutInstance.create({
      data: {
        user: {
          connect: {
            id: res.locals.user.id,
          },
        },
        workout: {
          connect: {
            id: workout.id,
          },
        },
        exercises: {
          create: workoutData.exercises.map((exercise) => ({
            exercise: { connect: { id: exercise.id } },
            sortOrder: exercise.sortOrder,
            wasSkipped: exercise.isDeleted,
            workoutExercise: { connect: { id: exercise.workoutExerciseId } },
            sets: {
              create: exercise.sets.map((set) =>
                exercise.isDeleted
                  ? {
                      reps: null,
                      time: null,
                      weight: null,
                      distance: null,
                      wasSkipped: true,
                    }
                  : {
                      reps: set.reps,
                      time: set.time,
                      weight: set.weight,
                      distance: set.distance,
                      wasSkipped: set.isDeleted,
                    }
              ),
            },
          })),
        },
      },
    });

    return res
      .status(201)
      .json({ success: true, data: 'Workout recorded successfully' });
  } catch (err) {
    next(err);
  }
}

export const WorkoutInstanceController = { store };
