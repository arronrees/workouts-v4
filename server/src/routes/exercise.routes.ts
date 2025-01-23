import { Router } from 'express';
import { ExerciseController } from '../controllers/exercise.controller';

export const exerciseRouter = Router();

exerciseRouter.get('/', ExerciseController.index);
