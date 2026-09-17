-- Legt het woord van de dag (Woord van de dag) per dayKey vast, zodat alle
-- spelers die dezelfde dag spelen gegarandeerd hetzelfde woord krijgen, ook
-- als de app tussendoor bijgewerkt wordt (zie de toelichting bij dit model
-- in schema.prisma). Zuiver additief: geen bestaande tabel/kolom wijzigt,
-- en bestaande WordGame-rijen (elk met hun eigen, al vastgelegde `word`)
-- blijven ongemoeid — deze tabel gaat alleen over dagen vanaf nu.
CREATE TABLE "DailyWord" (
    "dayKey" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyWord_pkey" PRIMARY KEY ("dayKey")
);
