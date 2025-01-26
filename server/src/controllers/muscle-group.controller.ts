import { NextFunction, Request, Response } from 'express';
import { JsonApiResponse, AuthLocals } from '../constant.types';
import { db } from '../db/db';

async function index(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  const muscleGroups = await db.muscle.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  return res.status(200).json({ success: true, data: muscleGroups });
}

export const MuscleGroupController = { index };
