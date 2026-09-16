-- Eén gedeeld hint-tegoed (User.hintBalance) i.p.v. losse per-partij
-- tegoeden die pas bij uitputting het gedeelde tegoed aanspraken — dat gaf
-- per scherm (winkel/Woordspel/Raad het hoofdstuk) een ander getal te zien.
-- Vouw eerst alle nog aanwezige per-partij tegoeden samen in het gedeelde
-- tegoed, vóórdat de kolommen verdwijnen, zodat niemand al verdiende maar
-- nog niet gebruikte hints kwijtraakt.
UPDATE "User" u
SET "hintBalance" = u."hintBalance" + sub.total
FROM (
  SELECT "userId" AS id, SUM("hintCredits") AS total
  FROM "ChapterGuessGame"
  WHERE "hintCredits" > 0
  GROUP BY "userId"
) sub
WHERE u.id = sub.id;

UPDATE "User" u
SET "hintBalance" = u."hintBalance" + sub.total
FROM (
  SELECT "player1Id" AS id, SUM("player1HintCredits") AS total
  FROM "ScrabbleGame"
  WHERE "player1HintCredits" > 0
  GROUP BY "player1Id"
) sub
WHERE u.id = sub.id;

UPDATE "User" u
SET "hintBalance" = u."hintBalance" + sub.total
FROM (
  SELECT "player2Id" AS id, SUM("player2HintCredits") AS total
  FROM "ScrabbleGame"
  WHERE "player2HintCredits" > 0
  GROUP BY "player2Id"
) sub
WHERE u.id = sub.id;

ALTER TABLE "ChapterGuessGame" DROP COLUMN "hintCredits";
ALTER TABLE "ScrabbleGame" DROP COLUMN "player1HintCredits";
ALTER TABLE "ScrabbleGame" DROP COLUMN "player2HintCredits";
