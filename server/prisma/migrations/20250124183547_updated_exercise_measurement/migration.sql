/*
  Warnings:

  - The values [reps] on the enum `ExerciseMeasurement` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `workoutId` on table `WorkoutExercise` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExerciseMeasurement_new" AS ENUM ('time', 'reps_only', 'distance', 'weight');
ALTER TABLE "Exercise" ALTER COLUMN "measurement" DROP DEFAULT;
ALTER TABLE "Exercise" ALTER COLUMN "measurement" TYPE "ExerciseMeasurement_new" USING ("measurement"::text::"ExerciseMeasurement_new");
ALTER TYPE "ExerciseMeasurement" RENAME TO "ExerciseMeasurement_old";
ALTER TYPE "ExerciseMeasurement_new" RENAME TO "ExerciseMeasurement";
DROP TYPE "ExerciseMeasurement_old";
ALTER TABLE "Exercise" ALTER COLUMN "measurement" SET DEFAULT 'weight';
COMMIT;

-- DropForeignKey
ALTER TABLE "WorkoutExercise" DROP CONSTRAINT "WorkoutExercise_workoutId_fkey";

-- AlterTable
ALTER TABLE "WorkoutExercise" ADD COLUMN     "notes" TEXT,
ALTER COLUMN "workoutId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkoutExercise" ADD CONSTRAINT "WorkoutExercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
