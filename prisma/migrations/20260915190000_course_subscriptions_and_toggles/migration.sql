-- AlterTable
ALTER TABLE "UserCourseProgress" ADD COLUMN     "subscribed" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "GameSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "wordGameEnabled" BOOLEAN NOT NULL DEFAULT true,
    "scrabbleEnabled" BOOLEAN NOT NULL DEFAULT true,
    "gezinsavondEnabled" BOOLEAN NOT NULL DEFAULT true,
    "chapterGuessEnabled" BOOLEAN NOT NULL DEFAULT true,
    "challengesEnabled" BOOLEAN NOT NULL DEFAULT true,
    "liveExercisesEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "GameSettings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "GameSettings" ("id") VALUES ('singleton') ON CONFLICT ("id") DO NOTHING;

-- Backfill: bestaande UserCourseProgress-rijen krijgen "subscribed" al via de
-- kolom-default hierboven (true) — niemand raakt dus een cursus kwijt uit
-- zijn overzicht die hij al via activeCourseId/UserCourseProgress gebruikte.
--
-- Twee cursustypes (PODCAST, KIDS) hebben echter nooit een UserCourseProgress
-- -rij nodig gehad om te kunnen gebruiken (zie PodcastEpisodeProgress/
-- KidsStoryProgress, los bijgehouden) — wie al afleveringen/verhalen deed
-- zonder de cursus ooit formeel te "activeren", zou 'm anders alsnog ten
-- onrechte uit het nieuwe persoonlijke overzicht zien verdwijnen. Alsnog
-- abonneren voor iedereen met bewijs van gebruik.
INSERT INTO "UserCourseProgress" ("id", "userId", "courseId", "subscribed", "lastActivityAt")
SELECT gen_random_uuid()::text, sub."userId", c."id", true, now()
FROM (SELECT DISTINCT "userId" FROM "PodcastEpisodeProgress") sub
CROSS JOIN (SELECT "id" FROM "Course" WHERE "type" = 'PODCAST' LIMIT 1) c
ON CONFLICT ("userId", "courseId") DO NOTHING;

INSERT INTO "UserCourseProgress" ("id", "userId", "courseId", "subscribed", "lastActivityAt")
SELECT gen_random_uuid()::text, sub."userId", c."id", true, now()
FROM (SELECT DISTINCT "userId" FROM "KidsStoryProgress") sub
CROSS JOIN (SELECT "id" FROM "Course" WHERE "type" = 'KIDS' LIMIT 1) c
ON CONFLICT ("userId", "courseId") DO NOTHING;

-- Gebruikers die nog helemaal niets gekozen hebben (geen activeCourseId, geen
-- enkele UserCourseProgress-rij) krijgen de nieuwe standaardcursus ("Van voor
-- naar achter") — dat is voor hen geen wijziging van gedrag (ze hadden nog
-- niets), alleen het beloofde startpunt.
INSERT INTO "UserCourseProgress" ("id", "userId", "courseId", "subscribed", "lastActivityAt")
SELECT gen_random_uuid()::text, u."id", c."id", true, now()
FROM "User" u
CROSS JOIN (SELECT "id" FROM "Course" WHERE "type" = 'FRONT_TO_BACK' LIMIT 1) c
WHERE u."activeCourseId" IS NULL
  AND NOT EXISTS (SELECT 1 FROM "UserCourseProgress" ucp WHERE ucp."userId" = u."id");

UPDATE "User" u
SET "activeCourseId" = c."id"
FROM (SELECT "id" FROM "Course" WHERE "type" = 'FRONT_TO_BACK' LIMIT 1) c
WHERE u."activeCourseId" IS NULL
  AND EXISTS (
    SELECT 1 FROM "UserCourseProgress" ucp
    WHERE ucp."userId" = u."id" AND ucp."courseId" = c."id"
  );
