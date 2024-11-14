import { Router } from 'express';
import { getUserController } from '../controllers/user.controller';

export const userRouter = Router();

userRouter.get('/me', getUserController);
