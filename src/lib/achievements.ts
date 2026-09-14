import type { Prisma } from "@prisma/client";

interface AchievementDef {
  slug: string;
  check: (tx: Prisma.TransactionClient, userId: string) => Promise<boolean>;
}

// Voorwaarden worden bij elke aanroep herberekend vanuit de huidige data
// (i.p.v. losse "event" tracking) — eenvoudiger correct te houden, en werkt
// ongeacht vanuit welke flow (les, freeze, duel, vriendschap) je aanroept.
const ACHIEVEMENTS: AchievementDef[] = [
  {
    slug: "streak-7",
    check: async (tx, userId) => {
      const u = await tx.user.findUniqueOrThrow({ where: { id: userId } });
      return u.longestStreak >= 7;
    },
  },
  {
    slug: "streak-30",
    check: async (tx, userId) => {
      const u = await tx.user.findUniqueOrThrow({ where: { id: userId } });
      return u.longestStreak >= 30;
    },
  },
  {
    slug: "first-chapter",
    check: async (tx, userId) => (await tx.chapterProgress.count({ where: { userId, completed: true } })) >= 1,
  },
  {
    slug: "xp-1000",
    check: async (tx, userId) => {
      const u = await tx.user.findUniqueOrThrow({ where: { id: userId } });
      return u.xpTotal >= 1000;
    },
  },
  {
    slug: "first-freeze-earned",
    check: async (tx, userId) => (await tx.freezeTransaction.count({ where: { userId, type: "EARNED" } })) >= 1,
  },
  {
    slug: "first-freeze-gifted",
    check: async (tx, userId) => (await tx.freezeTransaction.count({ where: { userId, type: "GIFT_SENT" } })) >= 1,
  },
  {
    slug: "first-friend",
    check: async (tx, userId) =>
      (await tx.friendship.count({
        where: { status: "ACCEPTED", OR: [{ senderId: userId }, { receiverId: userId }] },
      })) >= 1,
  },
  {
    slug: "first-duel-won",
    check: async (tx, userId) => {
      const played = await tx.liveGamePlayer.findMany({
        where: { userId, game: { status: "FINISHED" } },
        include: { game: { include: { players: true } } },
      });
      return played.some(
        (p) => p.score > 0 && p.game.players.every((other) => other.userId === p.userId || other.score < p.score)
      );
    },
  },
];

/** Herberekent alle achievement-voorwaarden en kent nieuw behaalde toe. */
export async function checkAndAwardAchievements(tx: Prisma.TransactionClient, userId: string): Promise<string[]> {
  const earned = await tx.userAchievement.findMany({
    where: { userId },
    select: { achievement: { select: { slug: true } } },
  });
  const alreadyEarned = new Set(earned.map((e) => e.achievement.slug));

  const newlyEarned: string[] = [];
  for (const def of ACHIEVEMENTS) {
    if (alreadyEarned.has(def.slug)) continue;
    if (!(await def.check(tx, userId))) continue;

    const achievement = await tx.achievement.findUnique({ where: { slug: def.slug } });
    if (!achievement) continue; // nog niet geseed

    await tx.userAchievement.create({ data: { userId, achievementId: achievement.id } });
    newlyEarned.push(def.slug);
  }
  return newlyEarned;
}
