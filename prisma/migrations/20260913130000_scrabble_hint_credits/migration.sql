-- Hint-tegoed per speler: begint op 0, +1 bij elke geslaagde woordplaatsing,
-- -1 bij het gebruiken van een hint. Zie src/lib/scrabble/hint.ts.
ALTER TABLE "ScrabbleGame" ADD COLUMN "player1HintCredits" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ScrabbleGame" ADD COLUMN "player2HintCredits" INTEGER NOT NULL DEFAULT 0;
