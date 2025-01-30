/*
  Warnings:

  - Added the required column `workoutExerciseId` to the `WorkoutExerciseInstance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkoutExerciseInstance" ADD COLUMN     "workoutExerciseId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkoutExerciseInstance" ADD CONSTRAINT "WorkoutExerciseInstance_workoutExerciseId_fkey" FOREIGN KEY ("workoutExerciseId") REFERENCES "WorkoutExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
