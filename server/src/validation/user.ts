import { z } from 'zod';
import { JsonApiResponse } from '../constant.types';
import { Request, Response, NextFunction } from 'express';

const updateUserData = z
  .object({
    username: z
      .string({ message: 'Username is required' })
      .min(4, 'Username must have at least 4 characters'),
    email: z.string({ message: 'Email is required' }).email(),
    currentPassword: z
      .string({ message: 'Password is required' })
      .nullable()
      .optional(),
    newPassword: z
      .string({ message: 'New password is required' })
      .min(5, 'New password must be at least 5 characters')
      .or(z.string().max(0)),
    confirmNewPassword: z
      .string({ message: 'Password confirmation is required' })
      .nullable()
      .optional(),
  })
  .strict();

export type UpdateUserType = z.infer<typeof updateUserData>;

export async function validateUpdateUserData(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    updateUserData.parse(req.body);

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
