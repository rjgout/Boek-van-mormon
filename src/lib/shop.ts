import { prisma } from "@/lib/db";
import { awardXp } from "@/lib/xp";
import { applyWeeklyXp } from "@/lib/leagues";

// Eerste (en vooralsnog enige) artikel in de winkel: een hint, inwisselbaar
// tegen XP. Het hint-tegoed dat dit oplevert (User.hintBalance) is los van
// de per-partij verdiende hints bij het Woordspel (ScrabbleGame.player1/
// 2HintCredits) — overal inzetbaar waar hints gebruikt kunnen worden, wat
// dat er ook bij komt na het Woordspel.
export const HINT_PRICE_XP = 10;

/**
 * Totaal aantal hints dat je daadwerkelijk kan inzetten: het algemene,
 * gekochte tegoed (User.hintBalance) plus alle per-partij verdiende
 * tegoeden van nog lopende potjes (Woordspel + Raad het hoofdstuk) — zelfde
 * optelsom als binnen zo'n lopend potje al getoond wordt (zie
 * totalHintsAvailable in chapterGuess.ts en de myHintCredits-berekening in
 * /api/scrabble/[gameId]), maar dan gesommeerd over ALLE lopende potjes
 * tegelijk zodat het getal op de winkelpagina nooit lager oogt dan wat je
 * daadwerkelijk hebt.
 */
export async function getTotalHintBalance(userId: string): Promise<number> {
  const [user, chapterGuessSum, scrabbleAsPlayer1, scrabbleAsPlayer2] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { hintBalance: true } }),
    prisma.chapterGuessGame.aggregate({
      where: { userId, status: "IN_PROGRESS" },
      _sum: { hintCredits: true },
    }),
    prisma.scrabbleGame.aggregate({
      where: { player1Id: userId, status: "ACTIVE" },
      _sum: { player1HintCredits: true },
    }),
    prisma.scrabbleGame.aggregate({
      where: { player2Id: userId, status: "ACTIVE" },
      _sum: { player2HintCredits: true },
    }),
  ]);

  return (
    user.hintBalance +
    (chapterGuessSum._sum.hintCredits ?? 0) +
    (scrabbleAsPlayer1._sum.player1HintCredits ?? 0) +
    (scrabbleAsPlayer2._sum.player2HintCredits ?? 0)
  );
}

export type BuyHintResult =
  | { ok: true; xpTotal: number; hintBalance: number }
  | { ok: false; error: string };

export async function buyHints(userId: string, quantity: number): Promise<BuyHintResult> {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, error: "Ongeldig aantal." };
  }
  const cost = quantity * HINT_PRICE_XP;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
      if (user.xpTotal < cost) {
        throw new InsufficientXpError();
      }
      await awardXp(tx, userId, -cost, "HINT_PURCHASED", { quantity });
      // Zonder dit bleef de divisiestand (WeeklyScore) op het oude, hogere
      // XP-bedrag staan na een aankoop — die wordt normaal alleen door
      // les-achtige "complete*"-functies in streak.ts bijgewerkt.
      await applyWeeklyXp(tx, userId, -cost);
      return tx.user.update({
        where: { id: userId },
        data: { hintBalance: { increment: quantity } },
      });
    });
    // De teruggegeven hintBalance is het totaal incl. lopende potjes (zie
    // getTotalHintBalance) — anders zou de winkelpagina na aankoop even een
    // te laag getal tonen totdat er iets anders het opnieuw ophaalt.
    return { ok: true, xpTotal: updated.xpTotal, hintBalance: await getTotalHintBalance(userId) };
  } catch (e) {
    if (e instanceof InsufficientXpError) {
      return { ok: false, error: `Je hebt niet genoeg XP (${cost} nodig).` };
    }
    throw e;
  }
}

// Tweede artikel in de winkel: een streak freeze, ook inwisselbaar tegen
// XP. Los van de freezes die je verdient op een streak-/hoofdstuk-mijlpaal
// (zie completeLesson e.a. in src/lib/streak.ts) of cadeau krijgt van een
// vriend (giftFreeze) — dit is gewoon een derde manier om aan User.freezeCount
// te komen, en telt daarom net als die andere twee mee in een eigen
// FreezeTransaction voor de audittrail.
export const FREEZE_PRICE_XP = 1000;

export type BuyFreezeResult =
  | { ok: true; xpTotal: number; freezeCount: number }
  | { ok: false; error: string };

export async function buyFreezes(userId: string, quantity: number): Promise<BuyFreezeResult> {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, error: "Ongeldig aantal." };
  }
  const cost = quantity * FREEZE_PRICE_XP;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
      if (user.xpTotal < cost) {
        throw new InsufficientXpError();
      }
      await awardXp(tx, userId, -cost, "FREEZE_PURCHASED", { quantity });
      await applyWeeklyXp(tx, userId, -cost);
      await tx.freezeTransaction.create({
        data: { userId, type: "PURCHASED", amount: quantity, reason: "Gekocht in de winkel" },
      });
      return tx.user.update({
        where: { id: userId },
        data: { freezeCount: { increment: quantity } },
      });
    });
    return { ok: true, xpTotal: updated.xpTotal, freezeCount: updated.freezeCount };
  } catch (e) {
    if (e instanceof InsufficientXpError) {
      return { ok: false, error: `Je hebt niet genoeg XP (${cost} nodig).` };
    }
    throw e;
  }
}

class InsufficientXpError extends Error {}
