import { Router } from 'express';
import {
  validateLoginUserData,
  validateRegisterUserData,
} from '../validation/auth';
import { SessionController } from '../controllers/auth/session.controller';
import { UserController } from '../controllers/user.controller';

export const authRouter = Router();

authRouter.post('/signup', validateRegisterUserData, UserController.store);

authRouter.post('/signin', validateLoginUserData, SessionController.store);

authRouter.delete('/signout', SessionController.destroy);
