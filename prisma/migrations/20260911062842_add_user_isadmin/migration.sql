-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- Bootstrap: op een bestaande installatie is er al een account voordat deze
-- kolom bestond. Maak de oudst geregistreerde gebruiker admin, zodat de
-- regel "de eerste registratie is admin" ook na deze migratie klopt en
-- /adminbackend niet onbereikbaar blijft.
UPDATE "User"
SET "isAdmin" = true
WHERE "id" = (SELECT "id" FROM "User" ORDER BY "createdAt" ASC LIMIT 1);
