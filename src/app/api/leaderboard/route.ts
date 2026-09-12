import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { weekStartKey } from "@/lib/dates";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const scope = req.nextUrl.searchParams.get("scope") === "friends" ? "friends" : "league";
  const weekStart = weekStartKey();

  const myScore = await prisma.weeklyScore.findUnique({
    where: { userId_weekStart: { userId: user.id, weekStart } },
  });
  const myTier = myScore?.tier ?? "BRONZE";

  let userIds: string[] | undefined;
  if (scope === "friends") {
    const friendships = await prisma.friendship.findMany({
      where: { status: "ACCEPTED", OR: [{ senderId: user.id }, { receiverId: user.id }] },
    });
    const friendIds = friendships.map((f) => (f.senderId === user.id ? f.receiverId : f.senderId));
    userIds = [user.id, ...friendIds];
  }

  const scores = await prisma.weeklyScore.findMany({
    where: {
      weekStart,
      ...(scope === "league" ? { tier: myTier } : {}),
      ...(userIds ? { userId: { in: userIds } } : {}),
    },
    include: { user: { select: { id: true, handle: true } } },
    orderBy: { xp: "desc" },
  });

  return NextResponse.json({
    weekStart,
    scope,
    myTier,
    hasActivityThisWeek: Boolean(myScore),
    // Bewust de handle (gekozen gebruikersnaam) i.p.v. displayName (echte
    // naam) — die is hier nergens voor nodig (zoeken gaat via handle#discri-
    // minator, niet op naam), dus geen reden om 'm hier te tonen.
    entries: scores.map((s, i) => ({
      rank: i + 1,
      userId: s.user.id,
      handle: s.user.handle,
      xp: s.xp,
      tier: s.tier,
      isMe: s.user.id === user.id,
    })),
  });
}
