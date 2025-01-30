-- CreateTable
CREATE TABLE "WorkoutInstance" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "WorkoutInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutExerciseInstance" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "WorkoutExerciseInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSetInstance" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reps" INTEGER,
    "weight" DOUBLE PRECISION,
    "time" DOUBLE PRECISION,
    "distance" DOUBLE PRECISION,
    "workoutExerciseId" TEXT,

    CONSTRAINT "WorkoutSetInstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutInstance_id_key" ON "WorkoutInstance"("id");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutExerciseInstance_id_key" ON "WorkoutExerciseInstance"("id");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutSetInstance_id_key" ON "WorkoutSetInstance"("id");

-- AddForeignKey
ALTER TABLE "WorkoutInstance" ADD CONSTRAINT "WorkoutInstance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExerciseInstance" ADD CONSTRAINT "WorkoutExerciseInstance_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExerciseInstance" ADD CONSTRAINT "WorkoutExerciseInstance_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "WorkoutInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSetInstance" ADD CONSTRAINT "WorkoutSetInstance_workoutExerciseId_fkey" FOREIGN KEY ("workoutExerciseId") REFERENCES "WorkoutExerciseInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
