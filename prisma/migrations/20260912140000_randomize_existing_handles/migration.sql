-- De vorige migratie gaf bestaande gebruikers een opeenvolgend nummer
-- (01, 02, 03, ...) op volgorde van registratie — dat verraadt wie het
-- eerst was, een soort ongewilde "competitie" in het getal zelf. En de
-- gekozen gebruikersnaam zelf was voor bestaande accounts vaak gewoon hun
-- echte (voor)naam, wat nu net niet de bedoeling is (zie Competitie:
-- die toont sinds kort de gebruikersnaam i.p.v. de echte naam — dat helpt
-- niet als de gebruikersnaam toevallig hetzelfde is).
--
-- Deze migratie geeft elke bestaande gebruiker daarom een nieuwe, volledig
-- willekeurige gebruikersnaam (bijvoeglijk naamwoord + zelfstandig
-- naamwoord, bv. "WijzeAdelaar") én een willekeurig 2-cijferig nummer, met
-- een botsingscheck per gebruiker (zoals ook /api/auth/register al doet)
-- zodat de combinatie uniek blijft. Echte naam (displayName) blijft
-- ongewijzigd — alleen de gebruikersnaam (handle+discriminator) verandert.
DO $$
DECLARE
  adjectives text[] := ARRAY['Blije','Dappere','Wijze','Vrolijke','Rustige','Sterke','Vriendelijke','Trouwe','Zonnige','Stille'];
  nouns text[] := ARRAY['Leeuw','Adelaar','Ster','Boom','Rivier','Vogel','Berg','Zon','Maan','Wolk'];
  r RECORD;
  new_handle text;
  new_discriminator text;
  attempts int;
BEGIN
  FOR r IN SELECT id FROM "User" ORDER BY "createdAt" LOOP
    attempts := 0;
    LOOP
      new_handle := adjectives[1 + floor(random() * array_length(adjectives, 1))::int] ||
                    nouns[1 + floor(random() * array_length(nouns, 1))::int];
      new_discriminator := lpad(floor(random() * 100)::text, 2, '0');
      attempts := attempts + 1;
      EXIT WHEN attempts > 200 OR NOT EXISTS (
        SELECT 1 FROM "User"
        WHERE lower(handle) = lower(new_handle) AND discriminator = new_discriminator AND id <> r.id
      );
    END LOOP;
    UPDATE "User" SET handle = new_handle, discriminator = new_discriminator WHERE id = r.id;
  END LOOP;
END $$;
