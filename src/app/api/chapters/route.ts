import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const chapters = await prisma.chapter.findMany({
    orderBy: [{ book: { order: "asc" } }, { order: "asc" }],
    include: { book: true, _count: { select: { exercises: { where: { status: "APPROVED" } } } } },
  });

  return NextResponse.json(
    chapters.map((c) => ({
      id: c.id,
      label: `${c.book.name} ${c.number}`,
      exerciseCount: c._count.exercises,
    }))
  );
}
