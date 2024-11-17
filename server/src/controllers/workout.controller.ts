import { Request, Response, NextFunction } from 'express';
import { JsonApiResponse, AuthLocals } from '../constant.types';
import { CreateWorkoutObject } from '../validation/workouts';
import { db } from '../db/db';

export async function getAllUserWorkouts(
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

export async function createNewWorkoutController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  try {
    const { body: newWorkout }: { body: CreateWorkoutObject } = req;

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
