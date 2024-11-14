import { Request, Response, NextFunction } from 'express';
import { JsonApiResponse, AuthLocals } from '../constant.types';
import { z } from 'zod';

export const createWorkoutModel = z
  .object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .min(1, 'Name is required'),
    exercises: z.array(
      z.object({
        id: z.string({
          required_error: 'Exercise ID is required',
          invalid_type_error: 'Exercise ID must be a string',
        }),
        sets: z.array(
          z.object({
            reps: z
              .number({
                required_error: 'Reps is required',
                invalid_type_error: 'Reps must be a number',
              })
              .nullable(),
            time: z
              .number({
                required_error: 'Time is required',
                invalid_type_error: 'Time must be a number',
              })
              .nullable(),
            weight: z
              .number({
                required_error: 'Weight is required',
                invalid_type_error: 'Weight must be a number',
              })
              .nullable(),
          })
        ),
        sortOrder: z.number({
          required_error: 'Sort order is required',
          invalid_type_error: 'Sort order must be a number',
        }),
      })
    ),
  })
  .strict();

export type CreateWorkoutObject = z.infer<typeof createWorkoutModel>;

export async function checkWorkoutObjectValid(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  try {
    createWorkoutModel.parse(req.body);

    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.format());

      return res
        .status(400)
        .json({ success: false, error: err.errors[0].message });
    } else {
      console.error(err);

      next(err);
    }
  }
}
