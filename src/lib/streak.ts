import type { XPReason, Prisma } from "@prisma/client";
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

type Tx = Prisma.TransactionClient;

interface DailyStreakResult {
  today: string;
  alreadyStudiedToday: boolean;
  currentStreak: number;
  longestStreak: number;
  streakBroken: boolean;
  freezeUsed: boolean;
  freezeCountBeforeMilestone: number;
  freezesEarned: number;
}

/**
 * De kern van "vandaag geldt als gestudeerd" — gedeeld tussen een volledig
 * afgeronde les (completeLesson) en een korte, hoofdstukloze oefenronde
 * (completeQuickPractice), zodat beide op dezelfde manier de streak
 * bijhouden. Schrijft de AUTO_SPENT-freezetransactie al weg indien van
 * toepassing, maar laat het definitieve user.update en de eventuele
 * EARNED-freezetransactie aan de aanroeper (die kan er zelf nog een
 * hoofdstuk-mijlpaal freeze bovenop doen).
 */
async function applyDailyStreak(tx: Tx, userId: string): Promise<DailyStreakResult> {
  const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
  const today = dayKey();
  const alreadyStudiedToday = user.lastStudyDate === today;

  let currentStreak = user.currentStreak;
  let freezeUsed = false;
  let streakBroken = false;
  let freezeCount = user.freezeCount;

  if (alreadyStudiedToday) {
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

  let freezesEarned = 0;
  const streakMilestoneHit =
    currentStreak > 0 &&
    currentStreak % STREAK_MILESTONE_FOR_FREEZE === 0 &&
    user.currentStreak % STREAK_MILESTONE_FOR_FREEZE !== 0;
  if (streakMilestoneHit && !alreadyStudiedToday) {
    freezesEarned += 1;
  }

  return {
    today,
    alreadyStudiedToday,
    currentStreak,
    longestStreak,
    streakBroken,
    freezeUsed,
    freezeCountBeforeMilestone: freezeCount,
    freezesEarned,
  };
}

/** Wekelijkse competitie-XP bijwerken (of de rij voor deze week aanmaken). */
async function applyWeeklyXp(tx: Tx, userId: string, xp: number): Promise<void> {
  const weekStart = weekStartKey();
  const existing = await tx.weeklyScore.findUnique({ where: { userId_weekStart: { userId, weekStart } } });
  if (existing) {
    await tx.weeklyScore.update({ where: { userId_weekStart: { userId, weekStart } }, data: { xp: { increment: xp } } });
  } else {
    const tier = await resolveStartingTier(tx, userId, weekStart);
    await tx.weeklyScore.create({ data: { userId, weekStart, xp, tier } });
  }
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

    const daily = await applyDailyStreak(tx, userId);
    let freezesEarned = daily.freezesEarned;
    let freezeCount = daily.freezeCountBeforeMilestone;

    // --- Freeze verdienen op hoofdstuk-mijlpaal (bovenop een eventuele streak-mijlpaal) ---
    if (!wasAlreadyCompleted && nowCompleted) {
      const completedCount = await tx.chapterProgress.count({ where: { userId, completed: true } });
      if (completedCount % LESSONS_MILESTONE_FOR_FREEZE === 0) {
        freezesEarned += 1;
      }
    }
    if (freezesEarned > 0) {
      freezeCount += freezesEarned;
      await tx.freezeTransaction.create({
        data: { userId, type: "EARNED", amount: freezesEarned, reason: "Mijlpaal bereikt" },
      });
    }

    await tx.user.update({
      where: { id: userId },
      data: {
        currentStreak: daily.currentStreak,
        longestStreak: daily.longestStreak,
        lastStudyDate: daily.today,
        freezeCount,
      },
    });

    await awardXp(tx, userId, xpForThisAttempt, xpReason, {
      chapterId,
      scorePercent,
      perfect: scorePercent === 100,
    });

    await applyWeeklyXp(tx, userId, xpForThisAttempt);

    const newAchievements = await checkAndAwardAchievements(tx, userId);

    return {
      xpEarned: xpForThisAttempt,
      chapterCompleted: nowCompleted,
      scorePercent,
      currentStreak: daily.currentStreak,
      longestStreak: daily.longestStreak,
      streakBroken: daily.streakBroken,
      freezeUsed: daily.freezeUsed,
      freezesEarned,
      freezeCount,
      newAchievements,
    };
  });
}

const XP_PER_CORRECT_QUICK_PRACTICE = 5;

/**
 * Een korte, hoofdstukloze oefenronde ("Snelle ronde") — redt de dagstreak
 * net als een volledige les, maar hangt aan geen enkele cursus/hoofdstuk en
 * levert dus minder XP op en raakt geen ChapterProgress.
 */
export async function completeQuickPractice(userId: string, correctCount: number, total: number): Promise<StudyResult> {
  return prisma.$transaction(async (tx) => {
    const daily = await applyDailyStreak(tx, userId);
    const freezeCount = daily.freezeCountBeforeMilestone + daily.freezesEarned;

    await tx.user.update({
      where: { id: userId },
      data: {
        currentStreak: daily.currentStreak,
        longestStreak: daily.longestStreak,
        lastStudyDate: daily.today,
        freezeCount,
      },
    });

    if (daily.freezesEarned > 0) {
      await tx.freezeTransaction.create({
        data: { userId, type: "EARNED", amount: daily.freezesEarned, reason: "Mijlpaal bereikt" },
      });
    }

    const xp = correctCount * XP_PER_CORRECT_QUICK_PRACTICE;
    if (xp > 0) {
      await awardXp(tx, userId, xp, "QUICK_PRACTICE", { correctCount, total });
      await applyWeeklyXp(tx, userId, xp);
    }

    const newAchievements = await checkAndAwardAchievements(tx, userId);

    return {
      xpEarned: xp,
      chapterCompleted: false,
      scorePercent: total === 0 ? 0 : Math.round((correctCount / total) * 100),
      currentStreak: daily.currentStreak,
      longestStreak: daily.longestStreak,
      streakBroken: daily.streakBroken,
      freezeUsed: daily.freezeUsed,
      freezesEarned: daily.freezesEarned,
      freezeCount,
      newAchievements,
    };
  });
}

/**
 * Rondt één van de twee modi (CONTENT/BOM_CONNECTION) van een
 * podcastaflevering af — zelfde soort boekhouding als completeLesson, maar
 * tegen PodcastEpisodeProgress i.p.v. ChapterProgress. Raakt bewust geen
 * UserCourseProgress: bij één aflevering is er nog geen "volgende" om naar
 * door te schuiven.
 */
export async function completePodcastLesson(
  userId: string,
  episodeId: string,
  mode: "CONTENT" | "BOM_CONNECTION",
  scorePercent: number,
  xpForThisAttempt: number
): Promise<StudyResult> {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.podcastEpisodeProgress.findUnique({
      where: { userId_episodeId_mode: { userId, episodeId, mode } },
    });
    const wasAlreadyCompleted = existing?.completed ?? false;
    const nowCompleted = wasAlreadyCompleted || scorePercent >= PASS_THRESHOLD;

    await tx.podcastEpisodeProgress.upsert({
      where: { userId_episodeId_mode: { userId, episodeId, mode } },
      create: {
        userId,
        episodeId,
        mode,
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

    const daily = await applyDailyStreak(tx, userId);
    const freezeCount = daily.freezeCountBeforeMilestone + daily.freezesEarned;

    await tx.user.update({
      where: { id: userId },
      data: {
        currentStreak: daily.currentStreak,
        longestStreak: daily.longestStreak,
        lastStudyDate: daily.today,
        freezeCount,
      },
    });

    if (daily.freezesEarned > 0) {
      await tx.freezeTransaction.create({
        data: { userId, type: "EARNED", amount: daily.freezesEarned, reason: "Mijlpaal bereikt" },
      });
    }

    await awardXp(tx, userId, xpForThisAttempt, "PODCAST_LESSON_COMPLETED", { episodeId, mode, scorePercent });
    await applyWeeklyXp(tx, userId, xpForThisAttempt);

    const newAchievements = await checkAndAwardAchievements(tx, userId);

    return {
      xpEarned: xpForThisAttempt,
      chapterCompleted: nowCompleted,
      scorePercent,
      currentStreak: daily.currentStreak,
      longestStreak: daily.longestStreak,
      streakBroken: daily.streakBroken,
      freezeUsed: daily.freezeUsed,
      freezesEarned: daily.freezesEarned,
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
