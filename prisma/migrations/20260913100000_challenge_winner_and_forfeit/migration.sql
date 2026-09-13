-- Nodig om te kunnen opgeven in een uitdaging: winnerUserId ligt dan
-- meteen vast (de andere speler), ongeacht scores/of iedereen al heeft
-- gespeeld. Ook gebruikt bij een normale afronding (zie recordChallengeAttempt
-- in src/lib/challenges.ts).
ALTER TABLE "Challenge" ADD COLUMN "winnerUserId" TEXT;

-- Backfill voor al afgeronde uitdagingen van vóór deze kolom bestond, zodat
-- de weergave (die nu op winnerUserId i.p.v. losse scorevergelijking draait)
-- voor bestaande resultaten hetzelfde blijft.
UPDATE "Challenge"
SET "winnerUserId" = CASE
  WHEN "senderScore" > "receiverScore" THEN "senderId"
  WHEN "receiverScore" > "senderScore" THEN "receiverId"
  ELSE NULL
END
WHERE status = 'FINISHED';
