import type { XPReason } from "@prisma/client";
import { prisma } from "@/lib/db";
import { dayKey, daysBetween, weekStartKey } from "@/lib/dates";
import { awardXp } from "@/lib/xp";
import { resolveStartingTier } from "@/lib/leagues";
import { checkAndAwardAchievements } from "@/lib/achievements";

const PASS_THRESHOLD = 60; // percentage nodig om een hoofdstuk als voltooid te tellen
const STREAK_MILESTONE_FOR_FREEZE = 7; // elke 7-daagse streak levert een freeze op
const LESSONS_MILESTONE_FOR_FREEZE = 10; // elke 10 voltooide hoofdstukken levert een freeze op

export interface StudyResult {
  xpEarned: number;
  chapterCompleted: boolean;
  scorePercent: number;
  currentStreak: number;
  longestStreak: number;
  streakBroken: boolean;
  freezeUsed: boolean;
  freezesEarned: number;
  freezeCount: number;
  newAchievements: string[];
}

/**
 * Verwerkt het resultaat van een les (of een live-spel, via `xpReason`): update
 * XP (met audittrail), hoofdstukvoortgang, streak, verdiende/verbruikte
 * streak freezes, divisie-XP en achievements.
 */
export async function completeLesson(
  userId: string,
  chapterId: string,
  scorePercent: number,
  xpForThisAttempt: number,
  xpReason: XPReason = "LESSON_COMPLETED"
): Promise<StudyResult> {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    const today = dayKey();

    // --- Hoofdstukvoortgang ---
    const existing = await tx.chapterProgress.findUnique({
      where: { userId_chapterId: { userId, chapterId } },
    });
    const wasAlreadyCompleted = existing?.completed ?? false;
    const nowCompleted = wasAlreadyCompleted || scorePercent >= PASS_THRESHOLD;

    await tx.chapterProgress.upsert({
      where: { userId_chapterId: { userId, chapterId } },
      create: {
        userId,
        chapterId,
        completed: nowCompleted,
        bestScore: scorePercent,
        xpEarned: xpForThisAttempt,
        completedAt: nowCompleted ? new Date() : null,
      },
      update: {
        completed: nowCompleted,
        bestScore: Math.max(existing?.bestScore ?? 0, scorePercent),
        xpEarned: { increment: xpForThisAttempt },
        completedAt: !wasAlreadyCompleted && nowCompleted ? new Date() : undefined,
      },
    });

    // --- Streak ---
    let currentStreak = user.currentStreak;
    let freezeUsed = false;
    let streakBroken = false;
    let freezeCount = user.freezeCount;

    if (user.lastStudyDate === today) {
      // al gestudeerd vandaag: streak blijft gelijk
    } else if (!user.lastStudyDate) {
      currentStreak = 1;
    } else {
      const gap = daysBetween(user.lastStudyDate, today);
      if (gap === 1) {
        currentStreak += 1;
      } else if (gap === 2 && freezeCount > 0) {
        // precies 1 dag gemist: een streak freeze redt de streak
        freezeCount -= 1;
        freezeUsed = true;
        currentStreak += 1;
        await tx.freezeTransaction.create({
          data: { userId, type: "AUTO_SPENT", amount: -1, reason: `Streak beschermd op ${today}` },
        });
      } else {
        streakBroken = currentStreak > 0;
        currentStreak = 1;
      }
    }
    const longestStreak = Math.max(user.longestStreak, currentStreak);

    // --- Freezes verdienen ---
    let freezesEarned = 0;
    const streakMilestoneHit =
      currentStreak > 0 &&
      currentStreak % STREAK_MILESTONE_FOR_FREEZE === 0 &&
      user.currentStreak % STREAK_MILESTONE_FOR_FREEZE !== 0;
    if (streakMilestoneHit && user.lastStudyDate !== today) {
      freezesEarned += 1;
    }

    if (!wasAlreadyCompleted && nowCompleted) {
      const completedCount = await tx.chapterProgress.count({
        where: { userId, completed: true },
      });
      if (completedCount % LESSONS_MILESTONE_FOR_FREEZE === 0) {
        freezesEarned += 1;
      }
    }

    if (freezesEarned > 0) {
      freezeCount += freezesEarned;
      await tx.freezeTransaction.create({
        data: {
          userId,
          type: "EARNED",
          amount: freezesEarned,
          reason: "Mijlpaal bereikt",
        },
      });
    }

    // --- Streak/freeze-velden (XP loopt apart via awardXp, zie onder) ---
    await tx.user.update({
      where: { id: userId },
      data: {
        currentStreak,
        longestStreak,
        lastStudyDate: today,
        freezeCount,
      },
    });

    await awardXp(tx, userId, xpForThisAttempt, xpReason, {
      chapterId,
      scorePercent,
      perfect: scorePercent === 100,
    });

    // --- Wekelijkse competitie / divisie ---
    const weekStart = weekStartKey();
    const existingWeeklyScore = await tx.weeklyScore.findUnique({
      where: { userId_weekStart: { userId, weekStart } },
    });
    if (existingWeeklyScore) {
      await tx.weeklyScore.update({
        where: { userId_weekStart: { userId, weekStart } },
        data: { xp: { increment: xpForThisAttempt } },
      });
    } else {
      const tier = await resolveStartingTier(tx, userId, weekStart);
      await tx.weeklyScore.create({ data: { userId, weekStart, xp: xpForThisAttempt, tier } });
    }

    const newAchievements = await checkAndAwardAchievements(tx, userId);

    return {
      xpEarned: xpForThisAttempt,
      chapterCompleted: nowCompleted,
      scorePercent,
      currentStreak,
      longestStreak,
      streakBroken,
      freezeUsed,
      freezesEarned,
      freezeCount,
      newAchievements,
    };
  });
}

/** Geeft een streak freeze weg aan een vriend. */
export async function giftFreeze(fromUserId: string, toUserId: string) {
  if (fromUserId === toUserId) {
    throw new Error("Je kan geen freeze aan jezelf geven.");
  }
  return prisma.$transaction(async (tx) => {
    const sender = await tx.user.findUniqueOrThrow({ where: { id: fromUserId } });
    if (sender.freezeCount < 1) {
      throw new Error("Je hebt geen streak freeze om weg te geven.");
    }
    await tx.user.update({
      where: { id: fromUserId },
      data: { freezeCount: { decrement: 1 } },
    });
    await tx.user.update({
      where: { id: toUserId },
      data: { freezeCount: { increment: 1 } },
    });
    await tx.freezeTransaction.create({
      data: { userId: fromUserId, type: "GIFT_SENT", amount: -1, relatedId: toUserId },
    });
    await tx.freezeTransaction.create({
      data: { userId: toUserId, type: "GIFT_RECEIVED", amount: 1, relatedId: fromUserId },
    });
    await checkAndAwardAchievements(tx, fromUserId);
  });
}
