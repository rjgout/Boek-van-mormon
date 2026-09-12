-- De discriminator gaat van 5 naar 2 cijfers (bv. "Jan#42" i.p.v.
-- "Jan#04213") — genoeg om binnen dezelfde handle uniek te blijven, en
-- prettiger leesbaar. Bestaande rijen krijgen per (ongevoelig-voor-
-- hoofdletters) handle een nieuw, opeenvolgend 2-cijferig nummer
-- toegekend, op volgorde van registratie — dezelfde aanpak als de
-- oorspronkelijke toekenning in 20260910163000_searchable_handle_tags,
-- maar dan met 2 in plaats van 5 cijfers.
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY lower(handle) ORDER BY "createdAt", id) AS rn
  FROM "User"
)
UPDATE "User" u
SET "discriminator" = lpad(ranked.rn::text, 2, '0')
FROM ranked
WHERE u.id = ranked.id;
