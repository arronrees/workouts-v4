/*
  Warnings:

  - You are about to drop the column `notes` on the `WorkoutExercise` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `WorkoutExerciseInstance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WorkoutExercise" DROP COLUMN "notes";

-- AlterTable
ALTER TABLE "WorkoutExerciseInstance" DROP COLUMN "notes";
