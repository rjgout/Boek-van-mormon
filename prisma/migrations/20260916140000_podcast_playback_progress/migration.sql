-- Nieuwe, volledig additieve tabel: onthoudt per gebruiker+aflevering waar
-- iemand gebleven was met luisteren naar een podcastaflevering (zie
-- PodcastMiniPlayer.tsx). Geen backfill nodig, geen bestaand gedrag verandert.
CREATE TABLE "PodcastPlaybackProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,
    "positionSeconds" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PodcastPlaybackProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PodcastPlaybackProgress_userId_episodeId_key" ON "PodcastPlaybackProgress"("userId", "episodeId");

ALTER TABLE "PodcastPlaybackProgress" ADD CONSTRAINT "PodcastPlaybackProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PodcastPlaybackProgress" ADD CONSTRAINT "PodcastPlaybackProgress_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "PodcastEpisode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
