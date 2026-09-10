-- Vervangt de unieke "username" door een niet-unieke "handle" + willekeurige
-- "discriminator" (samen wel uniek), zodat gebruikers vindbaar zijn zonder
-- hun e-mailadres te hoeven delen. Bestaande rijen behouden hun oude
-- username-waarde als handle (al gegarandeerd uniek, dus geen kans op
-- botsingen bij het toekennen van een willekeurige discriminator hieronder).

-- AlterTable: eerst nullable toevoegen, zodat we bestaande rijen kunnen vullen
ALTER TABLE "User" ADD COLUMN "handle" TEXT;
ALTER TABLE "User" ADD COLUMN "discriminator" TEXT;
ALTER TABLE "User" ADD COLUMN "searchableByEmail" BOOLEAN NOT NULL DEFAULT false;

UPDATE "User" SET
  "handle" = "username",
  "discriminator" = lpad(floor(random() * 100000)::text, 5, '0')
WHERE "handle" IS NULL;

ALTER TABLE "User" ALTER COLUMN "handle" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "discriminator" SET NOT NULL;

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username";

-- CreateIndex
CREATE UNIQUE INDEX "User_handle_discriminator_key" ON "User"("handle", "discriminator");
