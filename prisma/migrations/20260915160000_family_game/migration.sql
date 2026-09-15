-- AlterEnum
ALTER TYPE "LiveGameMode" ADD VALUE 'FAMILY_GAME';

-- CreateEnum
CREATE TYPE "FamilyGameDiceMode" AS ENUM ('DIGITAL', 'PHYSICAL');

-- AlterTable
ALTER TABLE "LiveGame" ADD COLUMN     "familyGameMinutes" INTEGER,
ADD COLUMN     "familyGameDiceMode" "FamilyGameDiceMode";
