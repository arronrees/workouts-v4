import { Router } from 'express';
import { MuscleGroupController } from '../controllers/muscle-group.controller';

export const muscleGroupRouter = Router();

muscleGroupRouter.get('/', MuscleGroupController.index);
