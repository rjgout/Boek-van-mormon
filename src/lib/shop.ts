import { prisma } from "@/lib/db";
import { awardXp } from "@/lib/xp";
import { applyWeeklyXp } from "@/lib/streak";

// Eerste (en vooralsnog enige) artikel in de winkel: een hint, inwisselbaar
// tegen XP. Het hint-tegoed dat dit oplevert (User.hintBalance) is los van
// de per-partij verdiende hints bij het Woordspel (ScrabbleGame.player1/
// 2HintCredits) — overal inzetbaar waar hints gebruikt kunnen worden, wat
// dat er ook bij komt na het Woordspel.
export const HINT_PRICE_XP = 10;

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
    return { ok: true, xpTotal: updated.xpTotal, hintBalance: updated.hintBalance };
  } catch (e) {
    if (e instanceof InsufficientXpError) {
      return { ok: false, error: `Je hebt niet genoeg XP (${cost} nodig).` };
    }
    throw e;
  }
}

class InsufficientXpError extends Error {}
