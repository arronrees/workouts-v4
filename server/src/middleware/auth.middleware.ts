import { JsonApiResponse, GuestLocals } from '../constant.types';
import { Response, Request, NextFunction } from 'express';
import {
  __in_production,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from '../constants';
import jwt from 'jsonwebtoken';
import { cookieOptions, createAccessToken } from '../lib/auth';
import { db } from '../db/db';

export type RefreshTokenData = {
  userId: string;
  refreshTokenVersion: number;
};

export type AccessTokenData = {
  userId: string;
};

export async function checkAuthTokens(
  req: Request,
  res: Response<JsonApiResponse> & { locals: GuestLocals },
  next: NextFunction
) {
  const { accessToken, refreshToken } = req.cookies;

  try {
    if (!accessToken) {
      throw 'No access token';
    }

    const data = <AccessTokenData>jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

    const user = await db.user.findUnique({ where: { id: data.userId } });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Unauthorised' });
    }

    res.locals.user = user;

    return next();
  } catch (err) {
    // token is expired or signed with a different secret
    // so now check refresh token
  }

  if (!refreshToken) {
    return res.status(401).json({ success: false, error: 'Unauthorised' });
  }

  // verify refresh token
  let data;
  try {
    data = <RefreshTokenData>jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch {
    return res.status(401).json({ success: false, error: 'Unauthorised' });
  }

  const user = await db.user.findUnique({ where: { id: data.userId } });

  if (!user || user.refreshTokenVersion !== data.refreshTokenVersion) {
    return res.status(401).json({ success: false, error: 'Unauthorised' });
  }

  res.locals.user = user;

  const newAccessToken = createAccessToken(user);

  res.cookie('accessToken', newAccessToken, {
    ...cookieOptions,
    maxAge: 1000 * 60 * 5, // 5 mins,
  });

  return next();
}
