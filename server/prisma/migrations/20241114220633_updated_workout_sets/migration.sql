/*
  Warnings:

  - The `reps` column on the `WorkoutSet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `weight` column on the `WorkoutSet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `time` column on the `WorkoutSet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "WorkoutSet" DROP COLUMN "reps",
ADD COLUMN     "reps" INTEGER,
DROP COLUMN "weight",
ADD COLUMN     "weight" DOUBLE PRECISION,
DROP COLUMN "time",
ADD COLUMN     "time" DOUBLE PRECISION;
