import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateUpdateUserData } from '../validation/user';

export const userRouter = Router();

userRouter.get('/', UserController.show);

userRouter.get('/me', UserController.me);

userRouter.post('/update', validateUpdateUserData, UserController.update);
