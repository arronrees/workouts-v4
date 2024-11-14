import { Router } from 'express';
import {
  checkUserSignupObjectValid,
  checkUserSigninObjectValid,
} from '../validation/auth';
import {
  signoutUser,
  signupUserController,
  signinUserController,
} from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.post('/signup', checkUserSignupObjectValid, signupUserController);

authRouter.post('/signin', checkUserSigninObjectValid, signinUserController);

authRouter.delete('/signout', signoutUser);
