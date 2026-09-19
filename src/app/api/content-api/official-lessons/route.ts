import { NextRequest, NextResponse } from "next/server";
import type { OfficialLessonSource } from "@prisma/client";
import { prisma } from "@/lib/db";
import { verifyContentApiKey } from "@/lib/contentApi";

/**
 * Lijst van geïmporteerde officiële lessen (zie officialContentImport.ts) —
 * bewust zonder rawHtml (kan groot zijn); gebruik GET /official-lessons/[id]
 * voor de volledige, ongewijzigde broncontent van één les.
 */
export async function GET(req: NextRequest) {
  if (!verifyContentApiKey(req)) {
    return NextResponse.json({ error: "Ongeldige of ontbrekende API-sleutel." }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const source = searchParams.get("source");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (source && source !== "FSY_YOUTH" && source !== "COME_FOLLOW_ME_YOUTH") {
    return NextResponse.json({ error: "Ongeldige source. Gebruik FSY_YOUTH of COME_FOLLOW_ME_YOUTH." }, { status: 400 });
  }

  const lessons = await prisma.importedOfficialLesson.findMany({
    where: {
      source: (source as OfficialLessonSource | null) ?? undefined,
      year: year ? Number(year) : undefined,
      month: month ? Number(month) : undefined,
    },
    orderBy: [{ year: "asc" }, { month: "asc" }, { sequenceInPeriod: "asc" }],
    select: {
      id: true,
      source: true,
      sourceUrl: true,
      language: true,
      title: true,
      periodLabel: true,
      year: true,
      month: true,
      sequenceInPeriod: true,
      contentHash: true,
      firstImportedAt: true,
      lastCheckedAt: true,
      lastChangedAt: true,
    },
  });

  return NextResponse.json({ ok: true, count: lessons.length, lessons });
}
