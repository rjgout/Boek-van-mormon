import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { weekStartKey } from "@/lib/dates";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const scope = req.nextUrl.searchParams.get("scope") === "friends" ? "friends" : "global";
  const weekStart = weekStartKey();

  let userIds: string[] | undefined;
  if (scope === "friends") {
    const friendships = await prisma.friendship.findMany({
      where: { status: "ACCEPTED", OR: [{ senderId: user.id }, { receiverId: user.id }] },
    });
    const friendIds = friendships.map((f) => (f.senderId === user.id ? f.receiverId : f.senderId));
    userIds = [user.id, ...friendIds];
  }

  const scores = await prisma.weeklyScore.findMany({
    where: { weekStart, ...(userIds ? { userId: { in: userIds } } : {}) },
    include: { user: { select: { id: true, username: true, displayName: true } } },
    orderBy: { xp: "desc" },
    take: scope === "global" ? 20 : undefined,
  });

  return NextResponse.json({
    weekStart,
    entries: scores.map((s, i) => ({
      rank: i + 1,
      userId: s.user.id,
      username: s.user.username,
      displayName: s.user.displayName,
      xp: s.xp,
      isMe: s.user.id === user.id,
    })),
  });
}
