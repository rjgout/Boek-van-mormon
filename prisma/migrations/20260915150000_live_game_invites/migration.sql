-- CreateTable
CREATE TABLE "LiveGameInvite" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveGameInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LiveGameInvite_gameId_userId_key" ON "LiveGameInvite"("gameId", "userId");

-- AddForeignKey
ALTER TABLE "LiveGameInvite" ADD CONSTRAINT "LiveGameInvite_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "LiveGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveGameInvite" ADD CONSTRAINT "LiveGameInvite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
