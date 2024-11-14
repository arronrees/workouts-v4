import { NextFunction, Request, Response } from 'express';
import { JsonApiResponse, AuthLocals } from '../constant.types';

export async function getUserController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  if (!res.locals.user) {
    console.log('here');
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
