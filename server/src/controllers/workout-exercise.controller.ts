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
            workout: { userId: res.locals.user.id },
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

export const WorkoutExerciseController = { index };
