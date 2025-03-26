import { NextFunction, Request, Response } from 'express';
import { JsonApiResponse, AuthLocals } from '../constant.types';
import { comparePassword, hashPassword, sendAuthCookies } from '../lib/auth';
import { db } from '../db/db';
import { User } from '../models/User';
import { RegisterUserType } from '../validation/auth';
import { UpdateUserType } from '../validation/user';

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
      id: res.locals.user.id,
      username: res.locals.user.username,
      email: res.locals.user.email,
      isVerified: res.locals.user.isVerified,
    },
  });
}

async function me(
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

async function update(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  try {
    const {
      email,
      username,
      currentPassword,
      newPassword,
      confirmNewPassword,
    }: UpdateUserType = req.body;

    if (
      currentPassword &&
      !(await comparePassword(currentPassword, res.locals.user.password))
    ) {
      return res
        .status(400)
        .json({ success: false, error: 'Current password is incorrect' });
    }

    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ success: false, error: 'New passwords do not match' });
    }

    if (await comparePassword(newPassword, res.locals.user.password)) {
      return res.status(400).json({
        success: false,
        error: 'New password is the same as the old password',
      });
    }

    if (newPassword && confirmNewPassword && !currentPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide current and new passwords',
      });
    }

    const emailUser = await db.user.findUnique({ where: { email } });
    if (emailUser && emailUser.id !== res.locals.user.id) {
      return res
        .status(400)
        .json({ success: false, error: 'Email is already in use' });
    }

    const usernameUser = await db.user.findUnique({
      where: { username: username.replace(/[^\w\s_\-]/g, '') },
    });
    if (usernameUser && usernameUser.id !== res.locals.user.id) {
      return res
        .status(400)
        .json({ success: false, error: 'Username is already in use' });
    }

    if (newPassword) {
      const hashedPassword = await hashPassword(newPassword);

      await db.user.update({
        where: { id: res.locals.user.id },
        data: {
          password: hashedPassword,
          email,
          username,
        },
      });
    } else {
      await db.user.update({
        where: { id: res.locals.user.id },
        data: {
          email,
          username,
        },
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
}

export const UserController = { show, store, me, update };
