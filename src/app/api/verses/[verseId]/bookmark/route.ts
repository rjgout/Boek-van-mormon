import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function POST(_req: Request, { params }: { params: Promise<{ verseId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { verseId } = await params;
  const existing = await prisma.bookmark.findUnique({ where: { userId_verseId: { userId: user.id, verseId } } });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return NextResponse.json({ bookmarked: false });
  }

  const verse = await prisma.verse.findUnique({ where: { id: verseId } });
  if (!verse) return NextResponse.json({ error: "Vers niet gevonden." }, { status: 404 });

  await prisma.bookmark.create({ data: { userId: user.id, verseId } });
  return NextResponse.json({ bookmarked: true });
}
