/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Muscle` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Exercise_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Muscle_name_key" ON "Muscle"("name");
