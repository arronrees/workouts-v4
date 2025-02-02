import { Request, Response, NextFunction } from 'express';
import { JsonApiResponse, AuthLocals } from '../constant.types';
import { db } from '../db/db';

async function index(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  try {
    const exercises = await db.exercise.findMany({
      where: {
        workoutExercises: {
          some: {
            userId: res.locals.user.id,
          },
        },
      },
      include: {
        muscles: { include: { muscle: true } },
        workoutExercises: {
          include: {
            sets: true,
            exerciseInstances: {
              take: 2,
              orderBy: { createdAt: 'desc' },
              include: { sets: true },
            },
          },
        },
      },
    });

    return res.status(200).json({ success: true, data: exercises });
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
    const { id } = req.params;

    const history = await db.workoutInstance.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        userId: res.locals.user.id,
        exercises: {
          some: {
            exercise: { id },
          },
        },
      },
      include: {
        workout: {
          include: {
            exercises: {
              where: { exerciseId: id },
              include: { sets: true },
            },
          },
        },
        exercises: {
          where: { exerciseId: id },
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
    });

    return res.status(200).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
}

export const WorkoutExerciseController = { index, show };
