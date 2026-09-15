-- CreateEnum
CREATE TYPE "SeasonStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LeagueTier" ADD VALUE 'MASTER';
ALTER TYPE "LeagueTier" ADD VALUE 'GRANDMASTER';
ALTER TYPE "LeagueTier" ADD VALUE 'LEGEND';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bestNationalRank" INTEGER;

-- AlterTable
ALTER TABLE "WeeklyScore" ADD COLUMN     "groupId" TEXT,
ADD COLUMN     "seasonId" TEXT;

-- CreateTable
CREATE TABLE "LeagueGroup" (
    "id" TEXT NOT NULL,
    "weekStart" TEXT NOT NULL,
    "tier" "LeagueTier" NOT NULL,
    "index" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "memberCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeagueGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "startWeek" TEXT NOT NULL,
    "weekCount" INTEGER NOT NULL,
    "status" "SeasonStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeasonResult" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "highestTier" "LeagueTier" NOT NULL,
    "finalTier" "LeagueTier" NOT NULL,
    "finalGroupPosition" INTEGER,
    "promotions" INTEGER NOT NULL DEFAULT 0,
    "demotions" INTEGER NOT NULL DEFAULT 0,
    "activeWeeks" INTEGER NOT NULL DEFAULT 0,
    "competitionsWon" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeasonResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionXpEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityKey" TEXT NOT NULL,
    "dayKey" TEXT NOT NULL,
    "weekStart" TEXT NOT NULL,
    "rawAmount" INTEGER NOT NULL,
    "awardedAmount" INTEGER NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetitionXpEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "groupSize" INTEGER NOT NULL DEFAULT 30,
    "promoteCount" INTEGER NOT NULL DEFAULT 3,
    "demoteCount" INTEGER NOT NULL DEFAULT 3,
    "minGroupSizeForMovement" INTEGER NOT NULL DEFAULT 10,
    "seasonWeekCount" INTEGER NOT NULL DEFAULT 6,
    "localeCode" TEXT NOT NULL DEFAULT 'nl-NL',
    "activityRules" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeagueSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeagueGroup_weekStart_tier_index_key" ON "LeagueGroup"("weekStart", "tier", "index");

-- CreateIndex
CREATE UNIQUE INDEX "Season_index_key" ON "Season"("index");

-- CreateIndex
CREATE UNIQUE INDEX "SeasonResult_seasonId_userId_key" ON "SeasonResult"("seasonId", "userId");

-- CreateIndex
CREATE INDEX "CompetitionXpEvent_userId_activityKey_dayKey_idx" ON "CompetitionXpEvent"("userId", "activityKey", "dayKey");

-- AddForeignKey
ALTER TABLE "WeeklyScore" ADD CONSTRAINT "WeeklyScore_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "LeagueGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyScore" ADD CONSTRAINT "WeeklyScore_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonResult" ADD CONSTRAINT "SeasonResult_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonResult" ADD CONSTRAINT "SeasonResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionXpEvent" ADD CONSTRAINT "CompetitionXpEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed het singleton-configuratierij met de standaardregels — zelfde vorm
-- als DEFAULT_ACTIVITY_RULES in src/lib/competitionXp.ts.
INSERT INTO "LeagueSettings" ("id", "activityRules", "updatedAt")
VALUES (
  'singleton',
  '{"DEFAULT":{"dailyCap":100,"decayFactor":0.6},"LESSON":{"dailyCap":150,"decayFactor":0.7,"winBonus":1.3},"QUICK_PRACTICE":{"dailyCap":60,"decayFactor":0.5},"CHAPTER_GUESS":{"dailyCap":80,"decayFactor":0.6,"levelMultiplier":{"BEGINNER":1,"ADVANCED":1.25,"EXPERT":1.5}},"WORD_GAME":{"dailyCap":50,"decayFactor":1},"PODCAST_LESSON":{"dailyCap":80,"decayFactor":0.7},"KIDS_STORY":{"dailyCap":80,"decayFactor":0.7},"SCRABBLE_WON":{"dailyCap":60,"decayFactor":0.7},"SCRABBLE_PLAYED":{"dailyCap":30,"decayFactor":0.7},"CHALLENGE_WON":{"dailyCap":60,"decayFactor":0.7}}',
  now()
)
ON CONFLICT ("id") DO NOTHING;

-- Eén startseizoen vanaf de huidige (ISO, maandag-start) week. Bestaande
-- WeeklyScore-rijen krijgen bewust GEEN seasonId (zie schema-commentaar bij
-- WeeklyScore): seizoenen tellen pas mee vanaf de week waarin deze migratie
-- draait, niet met terugwerkende kracht over onbekende oudere weken.
INSERT INTO "Season" ("id", "index", "startWeek", "weekCount", "status", "createdAt")
SELECT gen_random_uuid()::text, 1, to_char(date_trunc('week', now()), 'YYYY-MM-DD'), 6, 'ACTIVE', now()
WHERE NOT EXISTS (SELECT 1 FROM "Season");

-- Bestaande WeeklyScore-rijen alsnog in groepen van de standaard
-- groepsgrootte (30) indelen, per (weekStart, tier). Puur administratief:
-- dit verandert xp/tier van geen enkele rij, dus geen eerdere
-- promotie/degradatie-uitkomst wordt met terugwerkende kracht herschreven.
WITH ranked AS (
  SELECT
    "id",
    "weekStart",
    "tier",
    (ROW_NUMBER() OVER (PARTITION BY "weekStart", "tier" ORDER BY "id") - 1) / 30 AS group_index
  FROM "WeeklyScore"
),
groups_needed AS (
  SELECT DISTINCT "weekStart", "tier", group_index FROM ranked
),
inserted_groups AS (
  INSERT INTO "LeagueGroup" ("id", "weekStart", "tier", "index", "size", "memberCount", "createdAt")
  SELECT
    gen_random_uuid()::text,
    gn."weekStart",
    gn."tier",
    gn.group_index,
    30,
    (SELECT count(*) FROM ranked r WHERE r."weekStart" = gn."weekStart" AND r."tier" = gn."tier" AND r.group_index = gn.group_index),
    now()
  FROM groups_needed gn
  RETURNING "id", "weekStart", "tier", "index"
)
UPDATE "WeeklyScore" ws
SET "groupId" = ig."id"
FROM ranked r
JOIN inserted_groups ig
  ON ig."weekStart" = r."weekStart" AND ig."tier" = r."tier" AND ig."index" = r.group_index
WHERE ws."id" = r."id";
