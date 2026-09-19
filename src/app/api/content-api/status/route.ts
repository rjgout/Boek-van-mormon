import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyContentApiKey } from "@/lib/contentApi";

/**
 * Eerste/voorbeeld-endpoint van de content-API (zie src/lib/contentApi.ts en
 * CLAUDE.md, sectie "Content-API") — bevestigt dat de sleutel werkt en geeft
 * een globaal overzicht van de aanwezige content. Bewust alleen aantallen,
 * geen inhoud en geen gebruikersdata: dit endpoint dient als sjabloon voor
 * latere, specifiekere content-only routes onder /api/content-api/*.
 */
export async function GET(req: NextRequest) {
  if (!verifyContentApiKey(req)) {
    return NextResponse.json({ error: "Ongeldige of ontbrekende API-sleutel." }, { status: 401 });
  }

  const [books, chapters, verses, courses, podcastEpisodes, kidsStories, introLessons, persons] = await Promise.all([
    prisma.book.count(),
    prisma.chapter.count(),
    prisma.verse.count(),
    prisma.course.count(),
    prisma.podcastEpisode.count(),
    prisma.kidsStory.count(),
    prisma.introLesson.count(),
    prisma.person.count(),
  ]);

  return NextResponse.json({
    ok: true,
    contentCounts: { books, chapters, verses, courses, podcastEpisodes, kidsStories, introLessons, persons },
  });
}
