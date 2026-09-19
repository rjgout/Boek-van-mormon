-- AddColumn: eigen avatar-emoji, los van de gebruikersnaam.
-- Nullable zonder backfill: bestaande gebruikers krijgen gewoon null
-- (= letter-avatar zoals voorheen), niemand ziet ongevraagd een emoji.
ALTER TABLE "User" ADD COLUMN "avatarEmoji" TEXT;
