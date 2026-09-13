-- CreateEnum
CREATE TYPE "LiveGameMode" AS ENUM ('EXERCISES', 'CHAPTER_GUESS');

-- CreateEnum
CREATE TYPE "ChapterGuessLevel" AS ENUM ('BEGINNER', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "ChapterGuessGameStatus" AS ENUM ('IN_PROGRESS', 'FINISHED');

-- AlterEnum
ALTER TYPE "XPReason" ADD VALUE 'CHAPTER_GUESS_COMPLETED';

-- AlterTable
ALTER TABLE "LiveGame" ADD COLUMN     "level" "ChapterGuessLevel",
ADD COLUMN     "mode" "LiveGameMode" NOT NULL DEFAULT 'EXERCISES',
ADD COLUMN     "questionCount" INTEGER,
ALTER COLUMN "chapterId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ChapterGuessGame" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" "ChapterGuessLevel" NOT NULL,
    "questionCount" INTEGER NOT NULL,
    "currentIndex" INTEGER NOT NULL DEFAULT 0,
    "hintCredits" INTEGER NOT NULL DEFAULT 0,
    "status" "ChapterGuessGameStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "ChapterGuessGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterGuessQuestion" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "chapterId" TEXT NOT NULL,
    "optionIds" TEXT,
    "hintUsed" BOOLEAN NOT NULL DEFAULT false,
    "answeredChapterId" TEXT,
    "correct" BOOLEAN,

    CONSTRAINT "ChapterGuessQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChapterGuessQuestion_gameId_order_key" ON "ChapterGuessQuestion"("gameId", "order");

-- AddForeignKey
ALTER TABLE "ChapterGuessGame" ADD CONSTRAINT "ChapterGuessGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterGuessQuestion" ADD CONSTRAINT "ChapterGuessQuestion_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "ChapterGuessGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;
