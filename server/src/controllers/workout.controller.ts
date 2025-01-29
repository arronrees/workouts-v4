import { Request, Response, NextFunction } from 'express';
import { JsonApiResponse, AuthLocals } from '../constant.types';
import { StoreWorkoutType, UpdateWorkoutType } from '../validation/workouts';
import { db } from '../db/db';

async function index(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  const workouts = await db.workout.findMany({
    where: {
      userId: res.locals.user?.id,
    },
    include: {
      exercises: {
        include: {
          sets: true,
          exercise: true,
        },
      },
    },
  });

  return res.status(200).json({ success: true, data: workouts });
}

async function store(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  try {
    const { body: newWorkoutData }: { body: StoreWorkoutType } = req;

    const createdWorkout = await db.workout.create({
      data: {
        name: newWorkoutData.name,
        user: {
          connect: {
            id: res.locals.user.id,
          },
        },
        exercises: {
          create: newWorkoutData.exercises.map((exercise) => ({
            exercise: { connect: { id: exercise.id } },
            sortOrder: exercise.sortOrder,
            sets: {
              create: exercise.sets.map((set) => ({
                reps: set.reps,
                time: set.time,
                weight: set.weight,
                distance: set.distance,
              })),
            },
          })),
        },
      },
    });

    return res.status(201).json({ success: true, data: createdWorkout });
  } catch (err) {
    next(err);
  }
}

async function show(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, error: 'ID is required' });
  }

  const workout = await db.workout.findUnique({
    where: { id },
    include: {
      exercises: {
        include: {
          sets: true,
          exercise: {
            include: {
              muscles: {
                select: {
                  muscle: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!workout) {
    return res.status(404).json({ success: false, error: 'Workout not found' });
  }

  return res.status(200).json({ success: true, data: workout });
}

async function update(
  req: Request,
  res: Response<JsonApiResponse> & { locals: AuthLocals },
  next: NextFunction
) {
  try {
    const { body: workoutData }: { body: UpdateWorkoutType } = req;
    const { id } = req.params;

    const workout = await db.workout.findUnique({ where: { id } });

    if (!workout) {
      return res
        .status(404)
        .json({ error: 'Workout not found', success: false });
    }

    if (workoutData.name !== workout.name) {
      const updatedWorkout = await db.workout.update({
        where: { id },
        data: { name: workoutData.name },
      });
    }

    for (let i = 0; i < workoutData.exercises.length; i++) {
      const exercise = workoutData.exercises[i];

      if (exercise.workoutExerciseId) {
        const updatedExercise = await db.workoutExercise.update({
          where: {
            id: exercise.workoutExerciseId,
          },
          data: {
            sortOrder: exercise.sortOrder,
          },
        });

        if (exercise.isDeleted) {
          const deletedExercise = await db.workoutExercise.delete({
            where: { id: exercise.workoutExerciseId },
          });
        }
      } else {
        const newExercise = await db.workoutExercise.create({
          data: {
            sortOrder: exercise.sortOrder,
            exercise: {
              connect: {
                id: exercise.id,
              },
            },
            workout: {
              connect: {
                id: workout.id,
              },
            },
            sets: {
              create: exercise.sets.map((set) => ({
                reps: set.reps,
                time: set.time,
                weight: set.weight,
                distance: set.distance,
              })),
            },
          },
        });
      }

      for (let index = 0; index < exercise.sets.length; index++) {
        const set = exercise.sets[index];

        if (!exercise.isDeleted) {
          if (set.setId) {
            const updatedSet = await db.workoutSet.update({
              where: { id: set.setId },
              data: {
                distance: set.distance,
                time: set.time,
                reps: set.reps,
                weight: set.weight,
              },
            });

            if (set.isDeleted) {
              const deletedSet = await db.workoutSet.delete({
                where: {
                  id: set.setId,
                },
              });
            }
          } else {
            if (exercise.workoutExerciseId) {
              const newSet = await db.workoutSet.create({
                data: {
                  distance: set.distance,
                  time: set.time,
                  reps: set.reps,
                  weight: set.weight,
                  workoutExercise: {
                    connect: { id: exercise.workoutExerciseId },
                  },
                },
              });
            }
          }
        }
      }
    }

    return res
      .status(200)
      .json({ success: true, data: 'Workout updated successfully' });
  } catch (err) {
    next(err);
  }
}

export const WorkoutController = { index, store, show, update };
