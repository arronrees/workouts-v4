import { NextFunction, Request, Response } from 'express';
import { JsonApiResponse, AuthLocals } from '../constant.types';
import { db } from '../db/db';

async function index(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  const exercises = await db.exercise.findMany({ orderBy: { name: 'asc' } });

  return res.status(200).json({ success: true, data: exercises });
}

export const ExerciseController = { index };
