import { NextFunction, Request, Response } from 'express';
import { JsonApiResponse, ResLocals } from '../constant.types';
import { SigninUser, SignupUser } from '../validation/auth';
import { createUser, findUserByEmail, userExists } from '../lib/helpers/user';
import {
  clearAuthCookies,
  comparePassword,
  hashPassword,
  sendAuthCookies,
} from '../lib/auth';
import { db } from '../db/db';

export async function signupUserController(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const user: SignupUser = req.body;

    if (await userExists({ username: user.username })) {
      return res.status(400).json({
        success: false,
        error: 'Username taken, please try another',
      });
    }

    if (await userExists({ email: user.email })) {
      return res.status(400).json({
        success: false,
        error: 'User already registered',
      });
    }

    const hash = await hashPassword(user.password);

    const newUser = await createUser({
      ...user,
      username: user.username.replace(/[^\w\s_\-]/g, ''),
      password: hash,
    });

    sendAuthCookies(res, newUser);

    return res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function signinUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user: SigninUser = req.body;

    const foundUser = await findUserByEmail(user.email);

    if (!foundUser) {
      return res.status(400).json({
        success: false,
        error: `We can't find an account with that email, please sign up.`,
      });
    }

    const passwordsMatch = await comparePassword(
      user.password,
      foundUser.password
    );

    if (!passwordsMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    sendAuthCookies(res, foundUser);

    return res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function signoutUser(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals },
  next: NextFunction
) {
  try {
    clearAuthCookies(res);

    if (!res.locals.user) {
      console.log('user already signed out');
      return res.status(200).json({ success: false, error: 'User signed out' });
    }

    await db.user.update({
      where: { id: res.locals.user.id },
      data: {
        refreshTokenVersion: res.locals.user.refreshTokenVersion++,
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
}
