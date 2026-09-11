-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('PENDING', 'DECLINED', 'ACCEPTED', 'FINISHED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dailyReminderTime" TEXT NOT NULL DEFAULT '20:00',
ADD COLUMN     "emailNotificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastDailyReminderSentDate" TEXT,
ADD COLUMN     "lastWeeklyResultNotifiedWeek" TEXT,
ADD COLUMN     "pushNotificationsEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,

    CONSTRAINT "PushSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "ChallengeStatus" NOT NULL DEFAULT 'PENDING',
    "senderScore" INTEGER,
    "senderCompletedAt" TIMESTAMP(3),
    "receiverScore" INTEGER,
    "receiverCompletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- CreateIndex
CREATE INDEX "Challenge_receiverId_idx" ON "Challenge"("receiverId");

-- CreateIndex
CREATE INDEX "Challenge_senderId_idx" ON "Challenge"("senderId");

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
