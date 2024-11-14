import { compare, genSalt, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  __in_production,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  WEB_URL,
} from '../constants';
import { User } from '@prisma/client';
import { CookieOptions, Response } from 'express';

export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt();

  const hashedPassword = await hash(password, salt);

  return hashedPassword;
}

export async function comparePassword(
  inputPassword: string,
  passwordToCompare: string
): Promise<boolean> {
  const passwordsMatch = await compare(inputPassword, passwordToCompare);

  return passwordsMatch;
}

export function createAccessToken(user: User): string {
  return jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
    expiresIn: '5min',
  });
}

export function createRefreshToken(user: User): string {
  return jwt.sign(
    { userId: user.id, refreshTokenVersion: user.refreshTokenVersion },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: '30d',
    }
  );
}

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: __in_production,
  sameSite: 'lax',
  path: '/',
  domain: __in_production ? WEB_URL : '',
};

export function sendAuthCookies(res: Response, user: User): void {
  const accessToken = createAccessToken(user),
    refreshToken = createRefreshToken(user);

  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 1000 * 60 * 5, // 5 mins,
  });
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
}
