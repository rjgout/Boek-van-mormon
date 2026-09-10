import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const friendships = await prisma.friendship.findMany({
    where: { OR: [{ senderId: user.id }, { receiverId: user.id }] },
    include: {
      sender: { select: { id: true, handle: true, discriminator: true, displayName: true, xpTotal: true, currentStreak: true } },
      receiver: { select: { id: true, handle: true, discriminator: true, displayName: true, xpTotal: true, currentStreak: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const friends = friendships
    .filter((f) => f.status === "ACCEPTED")
    .map((f) => (f.senderId === user.id ? f.receiver : f.sender));

  const incoming = friendships
    .filter((f) => f.status === "PENDING" && f.receiverId === user.id)
    .map((f) => ({ friendshipId: f.id, from: f.sender }));

  const outgoing = friendships
    .filter((f) => f.status === "PENDING" && f.senderId === user.id)
    .map((f) => ({ friendshipId: f.id, to: f.receiver }));

  return NextResponse.json({ friends, incoming, outgoing });
}
