-- Los veld van logoDataUrl: het welkomscherm mag een ander (vaak groter,
-- alleenstaand) logo tonen dan de kleine header-logo. NULL = geen backfill
-- nodig, bestaande installaties tonen gewoon de tekstnaam zoals voorheen.
ALTER TABLE "BrandingSettings" ADD COLUMN "heroLogoDataUrl" TEXT;
