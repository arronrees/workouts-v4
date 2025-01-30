-- AlterTable
ALTER TABLE "WorkoutExerciseInstance" ADD COLUMN     "wasSkipped" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WorkoutSetInstance" ADD COLUMN     "wasSkipped" BOOLEAN NOT NULL DEFAULT false;
