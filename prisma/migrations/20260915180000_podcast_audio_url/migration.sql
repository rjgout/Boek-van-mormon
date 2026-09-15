-- AlterTable
ALTER TABLE "PodcastEpisode" ADD COLUMN     "audioUrl" TEXT;

-- Geen backfill nodig: bestaande rijen hadden dit onderscheid nog niet
-- (listenUrl was tot nu toe soms de webpagina, soms per ongeluk de
-- audio-enclosure). audioUrl vult zich vanzelf bij de eerstvolgende
-- podcastfeed-synchronisatie (zie syncPodcastFeed in src/lib/podcastFeed.ts,
-- aangeroepen vanuit db:seed / de "Herzaai"-knop in /adminbackend) — tot die
-- keer valt de embedded speler simpelweg terug op de externe link.
