import { Request, Response, NextFunction } from 'express';
import { JsonApiResponse, AuthLocals } from '../constant.types';
import { z } from 'zod';

export const storeWorkoutData = z
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
            distance: z
              .number({
                required_error: 'Distance is required',
                invalid_type_error: 'Distance must be a number',
              })
              .nullable(),
            sortOrder: z.number({
              required_error: 'Sort order is required',
              invalid_type_error: 'Sort order must be a number',
            }),
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

export type StoreWorkoutType = z.infer<typeof storeWorkoutData>;

export async function validateStoreWorkoutData(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  try {
    storeWorkoutData.parse(req.body);

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

export const updateWorkoutData = z
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
        workoutExerciseId: z
          .string({
            invalid_type_error: 'Workout Exercise ID must be a string',
          })
          .nullable(),
        isDeleted: z.boolean(),
        sets: z.array(
          z.object({
            setId: z
              .string({
                invalid_type_error: 'Set ID must be a string',
              })
              .nullable(),
            isDeleted: z.boolean(),
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
            distance: z
              .number({
                required_error: 'Distance is required',
                invalid_type_error: 'Distance must be a number',
              })
              .nullable(),
            sortOrder: z.number({
              required_error: 'Sort order is required',
              invalid_type_error: 'Sort order must be a number',
            }),
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

export type UpdateWorkoutType = z.infer<typeof updateWorkoutData>;

export async function validateUpdateWorkoutData(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  try {
    updateWorkoutData.parse(req.body);

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

export const recordWorkoutData = z
  .object({
    exercises: z.array(
      z.object({
        id: z.string({
          required_error: 'Exercise ID is required',
          invalid_type_error: 'Exercise ID must be a string',
        }),
        workoutExerciseId: z.string({
          invalid_type_error: 'Workout Exercise ID must be a string',
        }),
        isDeleted: z.boolean(),
        sets: z.array(
          z.object({
            isDeleted: z.boolean(),
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
            distance: z
              .number({
                required_error: 'Distance is required',
                invalid_type_error: 'Distance must be a number',
              })
              .nullable(),
            sortOrder: z.number({
              required_error: 'Sort order is required',
              invalid_type_error: 'Sort order must be a number',
            }),
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

export type RecordWorkoutType = z.infer<typeof recordWorkoutData>;

export async function validateRecordWorkoutData(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  try {
    recordWorkoutData.parse(req.body);

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
