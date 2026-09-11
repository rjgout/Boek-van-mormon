-- AlterEnum
ALTER TYPE "CourseType" ADD VALUE 'KIDS';

-- AlterEnum
ALTER TYPE "ExerciseType" ADD VALUE 'IMAGE_CHOICE';

-- AlterEnum
ALTER TYPE "XPReason" ADD VALUE 'KIDS_STORY_COMPLETED';

-- CreateTable
CREATE TABLE "KidsStory" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "KidsStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KidsExercise" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "ExerciseType" NOT NULL,
    "prompt" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "wordBank" TEXT,

    CONSTRAINT "KidsExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KidsExerciseOption" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "KidsExerciseOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KidsExerciseAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "givenText" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KidsExerciseAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KidsStoryProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "bestScore" INTEGER NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "KidsStoryProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KidsStory_number_key" ON "KidsStory"("number");

-- CreateIndex
CREATE UNIQUE INDEX "KidsStoryProgress_userId_storyId_key" ON "KidsStoryProgress"("userId", "storyId");

-- AddForeignKey
ALTER TABLE "KidsExercise" ADD CONSTRAINT "KidsExercise_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "KidsStory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KidsExerciseOption" ADD CONSTRAINT "KidsExerciseOption_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "KidsExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KidsExerciseAttempt" ADD CONSTRAINT "KidsExerciseAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KidsExerciseAttempt" ADD CONSTRAINT "KidsExerciseAttempt_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "KidsExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KidsStoryProgress" ADD CONSTRAINT "KidsStoryProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KidsStoryProgress" ADD CONSTRAINT "KidsStoryProgress_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "KidsStory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
