import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { notifyFriendRequest } from "@/lib/notify";

const schema = z.object({ targetUserId: z.string().trim().min(1) });

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Ongeldige invoer" }, { status: 400 });

  const target = await prisma.user.findUnique({ where: { id: parsed.data.targetUserId } });
  if (!target) return NextResponse.json({ error: "Gebruiker niet gevonden." }, { status: 404 });
  if (target.id === user.id) {
    return NextResponse.json({ error: "Je kan jezelf niet toevoegen." }, { status: 400 });
  }

  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { senderId: user.id, receiverId: target.id },
        { senderId: target.id, receiverId: user.id },
      ],
    },
  });
  if (existing) {
    return NextResponse.json({ error: "Er bestaat al een vriendschap of verzoek." }, { status: 409 });
  }

  const friendship = await prisma.friendship.create({
    data: { senderId: user.id, receiverId: target.id, status: "PENDING" },
  });

  notifyFriendRequest(target.id, user.handle).catch(() => {});

  return NextResponse.json({ id: friendship.id });
}
