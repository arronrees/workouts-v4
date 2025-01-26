-- AlterEnum
ALTER TYPE "ExerciseMeasurement" ADD VALUE 'time_or_distance';

-- AlterTable
ALTER TABLE "WorkoutSet" ADD COLUMN     "distance" DOUBLE PRECISION;
