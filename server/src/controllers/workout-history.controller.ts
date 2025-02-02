import { Request, Response, NextFunction } from 'express';
import { JsonApiResponse, AuthLocals } from '../constant.types';
import { db } from '../db/db';
import { RecordWorkoutType } from '../validation/workouts';

async function index(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  try {
    const { workoutId } = req.params;

    const history = await db.workoutInstance.findMany({
      where: { workoutId },
      include: {
        workout: { select: { name: true } },
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
}

async function show(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  try {
    const { workoutId, instanceId } = req.params;

    const history = await db.workoutInstance.findUnique({
      where: {
        id: instanceId,
      },
      include: {
        workout: { select: { name: true } },
        exercises: {
          orderBy: {
            sortOrder: 'asc',
          },
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
    });

    if (!history) {
      return res
        .status(404)
        .json({ success: false, error: 'Workout not found' });
    }

    return res.status(200).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
}

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
            user: {
              connect: {
                id: res.locals.user.id,
              },
            },
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
                      user: {
                        connect: {
                          id: res.locals.user.id,
                        },
                      },
                    }
                  : {
                      reps: set.reps,
                      time: set.time,
                      weight: set.weight,
                      distance: set.distance,
                      wasSkipped: set.isDeleted,
                      user: {
                        connect: {
                          id: res.locals.user.id,
                        },
                      },
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

export const WorkoutHistoryController = { store, index, show };
