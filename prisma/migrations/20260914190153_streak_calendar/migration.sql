-- CreateEnum
CREATE TYPE "StreakDayStatus" AS ENUM ('STUDIED', 'FROZEN');

-- CreateTable
CREATE TABLE "StreakDay" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dayKey" TEXT NOT NULL,
    "status" "StreakDayStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StreakDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StreakDay_userId_dayKey_key" ON "StreakDay"("userId", "dayKey");

-- AddForeignKey
ALTER TABLE "StreakDay" ADD CONSTRAINT "StreakDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Achteraf de kalender vullen voor bestaande gebruikers: er was tot nu toe
-- geen dag-voor-dag geschiedenis, alleen de cache-velden currentStreak/
-- lastStudyDate. We benaderen de geschiedenis door de laatste
-- currentStreak dagen tot en met lastStudyDate als STUDIED te markeren.
INSERT INTO "StreakDay" ("id", "userId", "dayKey", "status", "createdAt")
SELECT gen_random_uuid()::text, u."id", to_char(gs.day, 'YYYY-MM-DD'), 'STUDIED', now()
FROM "User" u
CROSS JOIN LATERAL generate_series(
  (u."lastStudyDate"::date - (u."currentStreak" - 1) * interval '1 day'),
  u."lastStudyDate"::date,
  interval '1 day'
) AS gs(day)
WHERE u."lastStudyDate" IS NOT NULL AND u."currentStreak" > 0
ON CONFLICT ("userId", "dayKey") DO NOTHING;

-- Van die benaderde STUDIED-reeks corrigeren we de dagen die we wél precies
-- weten dat een freeze overbrugde, naar FROZEN — af te leiden uit de vaste
-- tekst in FreezeTransaction.reason ("Streak beschermd op yyyy-mm-dd"), het
-- enige format dat vóór deze migratie bestond (altijd één dag terug).
INSERT INTO "StreakDay" ("id", "userId", "dayKey", "status", "createdAt")
SELECT gen_random_uuid()::text, ft."userId",
       to_char((substring(ft."reason" from 'Streak beschermd op (\d{4}-\d{2}-\d{2})'))::date - interval '1 day', 'YYYY-MM-DD'),
       'FROZEN', now()
FROM "FreezeTransaction" ft
WHERE ft."type" = 'AUTO_SPENT'
  AND ft."reason" ~ 'Streak beschermd op \d{4}-\d{2}-\d{2}'
ON CONFLICT ("userId", "dayKey") DO UPDATE SET "status" = 'FROZEN';
