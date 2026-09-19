-- CreateEnum
CREATE TYPE "OfficialLessonSource" AS ENUM ('FSY_YOUTH', 'COME_FOLLOW_ME_YOUTH');

-- CreateTable: ruwe, ongewijzigde broncontent van de officiële kerksite.
-- Nieuwe, losstaande tabel — raakt geen bestaande content/gebruikersdata.
CREATE TABLE "ImportedOfficialLesson" (
    "id" TEXT NOT NULL,
    "source" "OfficialLessonSource" NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'nld',
    "title" TEXT NOT NULL,
    "periodLabel" TEXT,
    "year" INTEGER,
    "month" INTEGER,
    "sequenceInPeriod" INTEGER,
    "rawHtml" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "firstImportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportedOfficialLesson_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ImportedOfficialLesson_sourceUrl_key" ON "ImportedOfficialLesson"("sourceUrl");
CREATE INDEX "ImportedOfficialLesson_source_year_month_idx" ON "ImportedOfficialLesson"("source", "year", "month");

-- CreateTable: log per importrun, voor zichtbaarheid.
CREATE TABLE "OfficialContentImportRun" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "urlsChecked" INTEGER NOT NULL DEFAULT 0,
    "newCount" INTEGER NOT NULL DEFAULT 0,
    "updatedCount" INTEGER NOT NULL DEFAULT 0,
    "unchangedCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "errors" TEXT,
    "triggeredBy" TEXT NOT NULL,

    CONSTRAINT "OfficialContentImportRun_pkey" PRIMARY KEY ("id")
);
