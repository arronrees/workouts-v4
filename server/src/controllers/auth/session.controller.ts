import { JsonApiResponse, AuthLocals } from '../../constant.types';
import { NextFunction, Request, Response } from 'express';
import {
  clearAuthCookies,
  comparePassword,
  sendAuthCookies,
} from '../../lib/auth';
import { db } from '../../db/db';
import { LoginUserType } from '../../validation/auth';
import { User } from '../../models/User';

export async function store(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const user: LoginUserType = req.body;

    const foundUser = await User.findByEmail(user.email);

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

export async function destroy(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
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

export const SessionController = { store, destroy };
