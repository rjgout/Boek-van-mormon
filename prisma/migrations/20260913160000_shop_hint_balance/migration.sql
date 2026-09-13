-- Winkel: eerste artikel is een hint (10 XP), een los tegoed bovenop de
-- per-partij verdiende hints bij het Woordspel. Zie src/lib/shop.ts.
ALTER TABLE "User" ADD COLUMN "hintBalance" INTEGER NOT NULL DEFAULT 0;

-- AlterEnum
ALTER TYPE "XPReason" ADD VALUE 'HINT_PURCHASED';
