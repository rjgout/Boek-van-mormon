import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ friendshipId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { friendshipId } = await params;
  const friendship = await prisma.friendship.findUnique({ where: { id: friendshipId } });
  if (!friendship || friendship.receiverId !== user.id) {
    return NextResponse.json({ error: "Verzoek niet gevonden." }, { status: 404 });
  }

  await prisma.friendship.update({ where: { id: friendshipId }, data: { status: "ACCEPTED" } });
  return NextResponse.json({ ok: true });
}
