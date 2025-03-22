import { NextFunction, Request, Response } from 'express';
import { JsonApiResponse, AuthLocals } from '../constant.types';
import { hashPassword, sendAuthCookies } from '../lib/auth';
import { db } from '../db/db';
import { User } from '../models/User';
import { RegisterUserType } from '../validation/auth';

async function show(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  if (!res.locals.user) {
    return res
      .status(401)
      .json({ success: false, error: 'User not authorised' });
  }

  return res.status(200).json({
    success: true,
    data: {
      username: res.locals.user.username,
      verified: res.locals.user.isVerified,
    },
  });
}

async function store(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const userData: RegisterUserType = req.body;

    if (await User.checkExists({ username: userData.username })) {
      return res.status(400).json({
        success: false,
        error: 'Username taken, please try another',
      });
    }

    if (await User.checkExists({ email: userData.email })) {
      return res.status(400).json({
        success: false,
        error: 'User already registered',
      });
    }

    const hash = await hashPassword(userData.password);

    const newUser = await db.user.create({
      data: {
        email: userData.email,
        username: userData.username.replace(/[^\w\s_\-]/g, ''),
        password: hash,
        isVerified: false,
      },
    });

    sendAuthCookies(res, newUser);

    return res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
}

export const UserController = { show, store };
