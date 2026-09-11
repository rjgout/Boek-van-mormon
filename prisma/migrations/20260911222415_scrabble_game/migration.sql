-- CreateEnum
CREATE TYPE "ScrabbleGameStatus" AS ENUM ('PENDING', 'DECLINED', 'ACTIVE', 'FINISHED');

-- CreateTable
CREATE TABLE "ScrabbleGame" (
    "id" TEXT NOT NULL,
    "player1Id" TEXT NOT NULL,
    "player2Id" TEXT NOT NULL,
    "status" "ScrabbleGameStatus" NOT NULL DEFAULT 'PENDING',
    "board" TEXT NOT NULL,
    "bag" TEXT NOT NULL,
    "player1Rack" TEXT NOT NULL,
    "player2Rack" TEXT NOT NULL,
    "player1Score" INTEGER NOT NULL DEFAULT 0,
    "player2Score" INTEGER NOT NULL DEFAULT 0,
    "turnUserId" TEXT,
    "consecutivePasses" INTEGER NOT NULL DEFAULT 0,
    "winnerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScrabbleGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrabbleMove" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "tilesPlaced" TEXT,
    "wordsFormed" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrabbleMove_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScrabbleGame_player1Id_idx" ON "ScrabbleGame"("player1Id");

-- CreateIndex
CREATE INDEX "ScrabbleGame_player2Id_idx" ON "ScrabbleGame"("player2Id");

-- CreateIndex
CREATE INDEX "ScrabbleMove_gameId_idx" ON "ScrabbleMove"("gameId");

-- AddForeignKey
ALTER TABLE "ScrabbleGame" ADD CONSTRAINT "ScrabbleGame_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrabbleGame" ADD CONSTRAINT "ScrabbleGame_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrabbleMove" ADD CONSTRAINT "ScrabbleMove_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "ScrabbleGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrabbleMove" ADD CONSTRAINT "ScrabbleMove_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
