import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const [courses, userProgress] = await Promise.all([
    prisma.course.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
      include: { _count: { select: { chapters: true } } },
    }),
    prisma.userCourseProgress.findMany({
      where: { userId: user.id, subscribed: true },
      include: { currentChapter: { include: { book: true } } },
    }),
  ]);

  const progressByCourseId = new Map(userProgress.map((p) => [p.courseId, p]));
  // Alleen de cursussen die deze gebruiker aan zijn persoonlijke lijst
  // toevoegde (zie subscribeUserToCourse) — de rest staat in de catalogus
  // (/api/courses/catalog, "Voeg nieuwe cursus toe").
  const subscribedCourses = courses.filter((c) => progressByCourseId.has(c.id));

  const result = await Promise.all(
    subscribedCourses.map(async (course) => {
      const progress = progressByCourseId.get(course.id);
      let completedCount = 0;
      if (course.type !== "FREE_CHOICE" && course._count.chapters > 0) {
        const chapterIds = (
          await prisma.courseChapter.findMany({ where: { courseId: course.id }, select: { chapterId: true } })
        ).map((c) => c.chapterId);
        completedCount = await prisma.chapterProgress.count({
          where: { userId: user.id, chapterId: { in: chapterIds }, completed: true },
        });
      }
      return {
        id: course.id,
        slug: course.slug,
        type: course.type,
        name: course.name,
        description: course.description,
        totalChapters: course._count.chapters,
        completedCount,
        isActive: user.activeCourseId === course.id,
        currentChapter: progress?.currentChapter
          ? {
              id: progress.currentChapter.id,
              bookName: progress.currentChapter.book.name,
              number: progress.currentChapter.number,
            }
          : null,
      };
    })
  );

  return NextResponse.json({ courses: result });
}
