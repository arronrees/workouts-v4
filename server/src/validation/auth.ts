import { z } from 'zod';
import { JsonApiResponse } from '../constant.types';
import { Request, Response, NextFunction } from 'express';

const signupUserModel = z
  .object({
    username: z
      .string({ message: 'Username is required' })
      .min(4, 'Username must have at least 4 characters'),
    email: z.string({ message: 'Email is required' }).email(),
    password: z
      .string({ message: 'Password is required' })
      .min(5, 'Password must be at least 5 characters'),
  })
  .strict();

export type SignupUser = z.infer<typeof signupUserModel>;

export async function checkUserSignupObjectValid(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    signupUserModel.parse(req.body);

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

const signinUserModel = z
  .object({
    email: z.string({ message: 'Email is required' }).email(),
    password: z.string({ message: 'Password is required' }),
  })
  .strict();

export type SigninUser = z.infer<typeof signinUserModel>;

export async function checkUserSigninObjectValid(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    signinUserModel.parse(req.body);

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
