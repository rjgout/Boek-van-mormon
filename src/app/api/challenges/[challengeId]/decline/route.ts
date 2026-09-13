import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { notifyChallengeDeclined } from "@/lib/notify";

export async function POST(_req: Request, { params }: { params: Promise<{ challengeId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { challengeId } = await params;
  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId }, include: { receiver: true } });
  if (!challenge || challenge.receiverId !== user.id) {
    return NextResponse.json({ error: "Uitdaging niet gevonden." }, { status: 404 });
  }
  if (challenge.status !== "PENDING") {
    return NextResponse.json({ error: "Deze uitdaging is al beantwoord." }, { status: 409 });
  }

  await prisma.challenge.update({ where: { id: challengeId }, data: { status: "DECLINED" } });
  notifyChallengeDeclined(challenge.senderId, challenge.receiver.handle).catch(() => {});
  return NextResponse.json({ ok: true });
}
