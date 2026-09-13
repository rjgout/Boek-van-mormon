-- CreateEnum
CREATE TYPE "WordGameStatus" AS ENUM ('IN_PROGRESS', 'WON', 'LOST');

-- AlterEnum
ALTER TYPE "XPReason" ADD VALUE 'WORD_GAME_WON';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastWordGameNotifiedDate" TEXT,
ADD COLUMN     "notifyAchievements" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyDailyReminder" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifySocial" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyWordGame" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "WordGame" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dayKey" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "guesses" TEXT NOT NULL DEFAULT '[]',
    "status" "WordGameStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "WordGame_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WordGame_userId_dayKey_key" ON "WordGame"("userId", "dayKey");

-- AddForeignKey
ALTER TABLE "WordGame" ADD CONSTRAINT "WordGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
