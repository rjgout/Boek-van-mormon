-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboardingSeenAt" TIMESTAMP(3);

-- Backfill: bestaande gebruikers hebben de onboarding-flow nooit gezien (die
-- bestond nog niet), maar mogen 'm ook niet alsnog met terugwerkende kracht
-- opgedrongen krijgen. Door onboardingSeenAt op hun createdAt te zetten,
-- ziet dashboard/page.tsx ze als "al gezien" en blijft de flow voorbehouden
-- aan registraties van na deze migratie.
UPDATE "User" SET "onboardingSeenAt" = "createdAt" WHERE "onboardingSeenAt" IS NULL;
