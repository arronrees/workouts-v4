import { Request, Response, NextFunction } from 'express';
import { JsonApiResponse, AuthLocals } from '../constant.types';
import { StoreWorkoutType } from '../validation/workouts';
import { db } from '../db/db';

async function index(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  const workouts = await db.workout.findMany({
    where: {
      userId: res.locals.user?.id,
    },
    include: {
      exercises: {
        include: {
          sets: true,
          exercise: true,
        },
      },
    },
  });

  return res.status(200).json({ success: true, data: workouts });
}

async function store(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  try {
    const { body: newWorkout }: { body: StoreWorkoutType } = req;

    const createdWorkout = await db.workout.create({
      data: {
        name: newWorkout.name,
        user: {
          connect: {
            id: res.locals.user.id,
          },
        },
        exercises: {
          create: newWorkout.exercises.map((exercise) => ({
            exercise: { connect: { id: exercise.id } },
            sortOrder: exercise.sortOrder,
            sets: {
              create: exercise.sets.map((set) => ({
                reps: set.reps,
                time: set.time,
                weight: set.weight,
                distance: set.distance,
              })),
            },
          })),
        },
      },
    });

    return res.status(201).json({ success: true, data: createdWorkout });
  } catch (err) {
    next(err);
  }
}

async function show(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, error: 'ID is required' });
  }

  const workout = await db.workout.findUnique({
    where: { id },
    include: {
      exercises: {
        include: {
          sets: true,
          exercise: {
            include: {
              muscles: {
                select: {
                  muscle: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!workout) {
    return res.status(404).json({ success: false, error: 'Workout not found' });
  }

  return res.status(200).json({ success: true, data: workout });
}

export const WorkoutController = { index, store, show };
