-- CreateEnum
CREATE TYPE "PodcastExerciseMode" AS ENUM ('CONTENT', 'BOM_CONNECTION');

-- AlterEnum
ALTER TYPE "CourseType" ADD VALUE 'PODCAST';

-- AlterEnum
ALTER TYPE "XPReason" ADD VALUE 'PODCAST_LESSON_COMPLETED';

-- CreateTable
CREATE TABLE "PodcastEpisode" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "listenUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PodcastEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PodcastExercise" (
    "id" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,
    "mode" "PodcastExerciseMode" NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "ExerciseType" NOT NULL,
    "prompt" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "wordBank" TEXT,

    CONSTRAINT "PodcastExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PodcastExerciseOption" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PodcastExerciseOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PodcastExerciseAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "givenText" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PodcastExerciseAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PodcastEpisodeProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,
    "mode" "PodcastExerciseMode" NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "bestScore" INTEGER NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "PodcastEpisodeProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PodcastEpisode_number_key" ON "PodcastEpisode"("number");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastEpisodeProgress_userId_episodeId_mode_key" ON "PodcastEpisodeProgress"("userId", "episodeId", "mode");

-- AddForeignKey
ALTER TABLE "PodcastExercise" ADD CONSTRAINT "PodcastExercise_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "PodcastEpisode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PodcastExerciseOption" ADD CONSTRAINT "PodcastExerciseOption_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "PodcastExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PodcastExerciseAttempt" ADD CONSTRAINT "PodcastExerciseAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PodcastExerciseAttempt" ADD CONSTRAINT "PodcastExerciseAttempt_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "PodcastExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PodcastEpisodeProgress" ADD CONSTRAINT "PodcastEpisodeProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PodcastEpisodeProgress" ADD CONSTRAINT "PodcastEpisodeProgress_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "PodcastEpisode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
