import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { verse: { include: { chapter: { include: { book: true } } } } },
  });

  return NextResponse.json(
    bookmarks.map((b) => ({
      verseId: b.verseId,
      bookName: b.verse.chapter.book.name,
      chapterNumber: b.verse.chapter.number,
      chapterId: b.verse.chapter.id,
      verseNumber: b.verse.number,
      text: b.verse.text,
    }))
  );
}
