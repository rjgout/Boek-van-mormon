-- AlterTable
ALTER TABLE "User" ADD COLUMN     "changelogEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "changelogSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ChangelogEntry" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChangelogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChangelogEntry_createdAt_idx" ON "ChangelogEntry"("createdAt");

-- Geen aparte backfill-UPDATE nodig (zie onboardingSeenAt in eerdere
-- migraties voor het patroon waar dat wel moest): voor changelogSeenAt is
-- voor ALLE bestaande gebruikers exact hetzelfde moment (nu, het moment van
-- migreren) de juiste waarde, en dat regelt de kolom-default hierboven al —
-- Postgres vult bestaande rijen bij ADD COLUMN met CURRENT_TIMESTAMP op het
-- moment van deze ALTER, niet per-rij opnieuw geëvalueerd.
