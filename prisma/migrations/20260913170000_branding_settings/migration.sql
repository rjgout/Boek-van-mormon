-- Optioneel eigen logo + favicon (zie /adminbackend), als data-URL
-- opgeslagen — zelfde aanpak als Feedback.screenshot, geen apart
-- bestandsopslagsysteem nodig.
CREATE TABLE "BrandingSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "logoDataUrl" TEXT,
    "faviconDataUrl" TEXT,

    CONSTRAINT "BrandingSettings_pkey" PRIMARY KEY ("id")
);
