-- Vrienden-aanwezigheid (online-status/activiteit/incognito). Alle velden
-- additief en default-safe: bestaande gebruikers delen na deze migratie
-- nog steeds niets (precies het huidige, impliciete gedrag), geen backfill
-- nodig.
ALTER TABLE "User" ADD COLUMN "shareOnlineStatus" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "shareCurrentActivity" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "invisibleUntil" TIMESTAMP(3);
