-- Optionele override van de vaste APP_NAME (zie src/lib/brand.ts). NULL
-- betekent "geen override", dus bestaande installaties blijven exact het
-- huidige gedrag houden (fallback naar APP_NAME) — geen backfill nodig.
ALTER TABLE "BrandingSettings" ADD COLUMN "appName" TEXT;
