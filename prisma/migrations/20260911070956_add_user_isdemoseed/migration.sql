-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isDemoSeed" BOOLEAN NOT NULL DEFAULT false;

-- Corrigeert een fout in de vorige migratie (20260911062842_add_user_isadmin):
-- die maakte domweg de OUDSTE gebruiker admin. Op installaties waar eerst
-- `npm run db:seed` gedraaid is (het aanbevolen installatiepad) en pas
-- daarna het echte account werd aangemaakt, was de "oudste gebruiker" per
-- ongeluk het demo-account "anna" in plaats van de echte eigenaar.
--
-- Markeer de bekende demo-accounts, haal daar adminrechten van af, en geef
-- adminrechten alsnog aan de oudste ECHTE registratie als er nog geen
-- niet-demo-admin bestaat.
UPDATE "User"
SET "isDemoSeed" = true
WHERE "email" IN ('anna@example.com', 'bram@example.com', 'carla@example.com');

UPDATE "User" SET "isAdmin" = false WHERE "isDemoSeed" = true;

UPDATE "User"
SET "isAdmin" = true
WHERE "id" = (SELECT "id" FROM "User" WHERE "isDemoSeed" = false ORDER BY "createdAt" ASC LIMIT 1)
  AND NOT EXISTS (SELECT 1 FROM "User" WHERE "isDemoSeed" = false AND "isAdmin" = true);
