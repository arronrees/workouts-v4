import * as dotenv from 'dotenv';
dotenv.config();
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { __in_production, WEB_URL } from './constants';
import { db } from './db/db';
import { authRouter } from './routes/auth.routes';
import { GuestLocals } from './constant.types';
import { checkAuthTokens } from './middleware/auth.middleware';
import { userRouter } from './routes/user.routes';
import { workoutRouter } from './routes/workout.routes';
import { exerciseRouter } from './routes/exercise.routes';
import { muscleGroupRouter } from './routes/muscle-group.routes';
import { workoutHistoryRouter } from './routes/workout-history.routes';
import { workoutExerciseRouter } from './routes/workout-exercise.routes';

const app = express();

// middleware
app.use(cookieParser());
app.use(cors({ credentials: true, origin: WEB_URL }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// reset locals
app.use(
  (
    req: Request,
    res: Response & { locals: GuestLocals },
    next: NextFunction
  ) => {
    res.locals.user = null;

    console.log('------------');

    next();
  }
);

app.use('/api/auth', authRouter);
app.use(checkAuthTokens);
app.use('/api/user', userRouter);
app.use('/api/workouts/history', workoutHistoryRouter);
app.use('/api/workouts', workoutRouter);
app.use('/api/workout-exercises', workoutExerciseRouter);
app.use('/api/exercises', exerciseRouter);
app.use('/api/muscle-groups', muscleGroupRouter);

// 404 handler
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({ error: '404 - Route not found' });
});

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('--- error handler');
  console.error(err);

  res
    .status(500)
    .json({ error: __in_production ? '500 - Server error' : err.message });
});

db.$connect().then(() => {
  console.log('DB connected');

  app.listen(4000, () => {
    console.log('Server running on port 4000');
  });
});
