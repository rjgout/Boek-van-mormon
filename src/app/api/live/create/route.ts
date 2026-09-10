import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

const generateCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 5);
const schema = z.object({ chapterId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Kies een hoofdstuk." }, { status: 400 });

  const chapter = await prisma.chapter.findUnique({ where: { id: parsed.data.chapterId } });
  if (!chapter) return NextResponse.json({ error: "Hoofdstuk niet gevonden." }, { status: 404 });

  let code = generateCode();
  for (let attempts = 0; attempts < 5; attempts++) {
    const clash = await prisma.liveGame.findUnique({ where: { code } });
    if (!clash) break;
    code = generateCode();
  }

  const game = await prisma.liveGame.create({
    data: { code, hostId: user.id, chapterId: chapter.id, status: "LOBBY" },
  });
  await prisma.liveGamePlayer.create({ data: { gameId: game.id, userId: user.id } });

  return NextResponse.json({ code: game.code });
}
