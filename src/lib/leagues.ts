import type { Prisma, LeagueTier } from "@prisma/client";

export const TIER_ORDER: LeagueTier[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"];

export const TIER_LABELS: Record<LeagueTier, string> = {
  BRONZE: "Bronzen divisie",
  SILVER: "Zilveren divisie",
  GOLD: "Gouden divisie",
  PLATINUM: "Platina divisie",
  DIAMOND: "Diamanten divisie",
};

export const TIER_ICONS: Record<LeagueTier, string> = {
  BRONZE: "🥉",
  SILVER: "🥈",
  GOLD: "🥇",
  PLATINUM: "💠",
  DIAMOND: "💎",
};

// Configureerbaar (productplan vraagt expliciet om aanpasbare balans):
const PROMOTE_COUNT = 3; // top N van een divisie-groep promoveert
const DEMOTE_COUNT = 3; // onderste N degradeert
const MIN_GROUP_SIZE_FOR_DEMOTION = 5; // te kleine groepen: niemand degradeert

function previousWeekStart(weekStart: string): string {
  const d = new Date(`${weekStart}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 7);
  return d.toISOString().slice(0, 10);
}

/**
 * Bepaalt in welke divisie een gebruiker deze week start, op basis van hun
 * positie in de divisie van vorige week. Wordt "lazy" aangeroepen zodra
 * iemand voor het eerst deze week XP verdient in plaats van via een
 * wekelijkse cron-taak — functioneel gelijkwaardig, zonder extra infra.
 */
export async function resolveStartingTier(
  tx: Prisma.TransactionClient,
  userId: string,
  weekStart: string
): Promise<LeagueTier> {
  const prevWeek = previousWeekStart(weekStart);
  const prevScore = await tx.weeklyScore.findUnique({
    where: { userId_weekStart: { userId, weekStart: prevWeek } },
  });
  if (!prevScore) return "BRONZE";

  const peers = await tx.weeklyScore.findMany({
    where: { weekStart: prevWeek, tier: prevScore.tier },
    orderBy: { xp: "desc" },
    select: { userId: true },
  });
  const rank = peers.findIndex((p) => p.userId === userId); // 0-based
  const total = peers.length;
  const tierIndex = TIER_ORDER.indexOf(prevScore.tier);

  if (rank !== -1 && rank < PROMOTE_COUNT && tierIndex < TIER_ORDER.length - 1) {
    return TIER_ORDER[tierIndex + 1];
  }
  if (rank !== -1 && total >= MIN_GROUP_SIZE_FOR_DEMOTION && rank >= total - DEMOTE_COUNT && tierIndex > 0) {
    return TIER_ORDER[tierIndex - 1];
  }
  return prevScore.tier;
}
