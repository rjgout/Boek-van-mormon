import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { weekStartKey } from "@/lib/dates";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const [chaptersCompleted, versesTotal, duelsWon, duelsPlayed, allAchievements, earned, weeklyScore] =
    await Promise.all([
      prisma.chapterProgress.count({ where: { userId: user.id, completed: true } }),
      prisma.chapterProgress.count({ where: { userId: user.id } }),
      prisma.liveGamePlayer.findMany({
        where: { userId: user.id, game: { status: "FINISHED" } },
        include: { game: { include: { players: true } } },
      }),
      prisma.liveGamePlayer.count({ where: { userId: user.id, game: { status: "FINISHED" } } }),
      prisma.achievement.findMany({ orderBy: { name: "asc" } }),
      prisma.userAchievement.findMany({ where: { userId: user.id } }),
      prisma.weeklyScore.findUnique({ where: { userId_weekStart: { userId: user.id, weekStart: weekStartKey() } } }),
    ]);

  const wins = duelsWon.filter((p) => p.score > 0 && p.game.players.every((other) => other.score <= p.score)).length;
  const earnedByAchievementId = new Map(earned.map((e) => [e.achievementId, e.earnedAt]));

  return NextResponse.json({
    displayName: user.handle,
    handle: user.handle,
    discriminator: user.discriminator,
    email: user.email,
    searchableByEmail: user.searchableByEmail,
    emailNotificationsEnabled: user.emailNotificationsEnabled,
    pushNotificationsEnabled: user.pushNotificationsEnabled,
    dailyReminderTime: user.dailyReminderTime,
    xpTotal: user.xpTotal,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    freezeCount: user.freezeCount,
    chaptersCompleted,
    chaptersStarted: versesTotal,
    duelsPlayed,
    duelsWon: wins,
    tier: weeklyScore?.tier ?? null,
    achievements: allAchievements.map((a) => ({
      slug: a.slug,
      name: a.name,
      description: a.description,
      icon: a.icon,
      earnedAt: earnedByAchievementId.get(a.id) ?? null,
    })),
  });
}
