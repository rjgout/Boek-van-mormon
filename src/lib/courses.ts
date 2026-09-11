import type { PrismaClient } from "@prisma/client";

export const FRONT_TO_BACK_SLUG = "voor-naar-achter";
export const FREE_CHOICE_SLUG = "vrije-keuze";
export const PODCAST_SLUG = "podcast";

/**
 * Bouwt de structurele cursussen (van-voor-naar-achter, vrije keuze, en één
 * per boek) opnieuw op vanuit de huidige boeken/hoofdstukken. Bewust
 * idempotent: opnieuw draaien na een content-import zet alles weer in sync.
 * Gebruikersvoortgang (UserCourseProgress) blijft intact, want Chapter-ID's
 * blijven stabiel over een re-import heen — alleen de CourseChapter-
 * koppelrijen worden hier weggegooid en herbouwd.
 */
export async function syncCourses(db: PrismaClient): Promise<void> {
  const books = await db.book.findMany({
    orderBy: { order: "asc" },
    include: { chapters: { orderBy: { order: "asc" } } },
  });

  await db.course.upsert({
    where: { slug: FREE_CHOICE_SLUG },
    update: { name: "Vrije keuze", order: 0 },
    create: {
      slug: FREE_CHOICE_SLUG,
      type: "FREE_CHOICE",
      name: "Vrije keuze",
      description: "Kies zelf welk hoofdstuk je wil doen, in elke volgorde.",
      order: 0,
    },
  });

  const frontToBack = await db.course.upsert({
    where: { slug: FRONT_TO_BACK_SLUG },
    update: { name: "Van voor naar achter", order: 1 },
    create: {
      slug: FRONT_TO_BACK_SLUG,
      type: "FRONT_TO_BACK",
      name: "Van voor naar achter",
      description: "Eén vaste volgorde door het hele Boek van Mormon, hoofdstuk na hoofdstuk.",
      order: 1,
    },
  });
  await db.courseChapter.deleteMany({ where: { courseId: frontToBack.id } });
  const frontToBackRows = books.flatMap((book) => book.chapters).map((chapter, order) => ({
    courseId: frontToBack.id,
    chapterId: chapter.id,
    order,
  }));
  if (frontToBackRows.length > 0) {
    await db.courseChapter.createMany({ data: frontToBackRows });
  }

  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const slug = `boek-${book.slug}`;
    const course = await db.course.upsert({
      where: { slug },
      update: { name: book.name, bookId: book.id, order: 2 + i },
      create: { slug, type: "BY_BOOK", name: book.name, bookId: book.id, order: 2 + i },
    });
    await db.courseChapter.deleteMany({ where: { courseId: course.id } });
    const rows = book.chapters.map((chapter, order) => ({ courseId: course.id, chapterId: chapter.id, order }));
    if (rows.length > 0) {
      await db.courseChapter.createMany({ data: rows });
    }
  }

  // Singleton, net als vrije keuze: geen CourseChapter-rijen — de
  // PodcastEpisode-rijen (zie prisma/importPodcast.ts) horen er impliciet
  // allemaal bij.
  await db.course.upsert({
    where: { slug: PODCAST_SLUG },
    update: { name: "Geloof je dat ook? podcast", order: 2 + books.length },
    create: {
      slug: PODCAST_SLUG,
      type: "PODCAST",
      name: "Geloof je dat ook? podcast",
      description: "Elke aflevering: vragen over de aflevering zelf, en de brug naar het Boek van Mormon.",
      order: 2 + books.length,
    },
  });
}

/**
 * Bepaalt en registreert het volgende hoofdstuk in een cursus voor een
 * gebruiker, na het afronden van `completedChapterId` (of bij een eerste
 * bezoek als die nog niet is opgegeven). Voor FREE_CHOICE wordt nooit een
 * "volgende" hoofdstuk vastgelegd — dat blijft altijd de eigen keuze.
 */
export async function advanceCourseProgress(
  db: PrismaClient,
  userId: string,
  courseId: string,
  completedChapterId?: string
): Promise<void> {
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: { chapters: { orderBy: { order: "asc" }, select: { chapterId: true } } },
  });
  if (!course || course.type === "FREE_CHOICE") return;

  const orderedChapterIds = course.chapters.map((c) => c.chapterId);
  let nextChapterId: string | null;
  if (completedChapterId) {
    const idx = orderedChapterIds.indexOf(completedChapterId);
    if (idx === -1) return; // dit hoofdstuk hoort niet bij deze cursus, niks aanpassen
    nextChapterId = orderedChapterIds[idx + 1] ?? null;
  } else {
    nextChapterId = orderedChapterIds[0] ?? null;
  }

  await db.userCourseProgress.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: { currentChapterId: nextChapterId, lastActivityAt: new Date() },
    create: { userId, courseId, currentChapterId: nextChapterId },
  });
}
