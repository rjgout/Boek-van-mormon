import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { isEmailConfigured } from "@/lib/email";
import { advanceCourseProgress } from "@/lib/courses";
import FrontToBackCourseView from "@/components/FrontToBackCourseView";

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.mustChangePassword) redirect("/change-password");
  if (!user.emailVerifiedAt && !user.isDemoSeed && (await isEmailConfigured())) {
    redirect("/verify-email");
  }

  const { courseId } = await params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      chapters: {
        orderBy: { order: "asc" },
        include: {
          chapter: {
            include: {
              book: true,
              verses: { select: { text: true } },
              _count: { select: { verses: true, exercises: true } },
              progress: { where: { userId: user.id } },
            },
          },
        },
      },
    },
  });
  if (!course) redirect("/courses");

  // Alleen "van voor naar achter" heeft hier al zijn eigen weergave — de
  // andere cursustypes volgen in latere fases (zie /dashboard voor hun
  // huidige, generieke weergave).
  if (course.type !== "FRONT_TO_BACK") {
    redirect("/dashboard");
  }

  let courseProgress = await prisma.userCourseProgress.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
  });
  if (!courseProgress) {
    await advanceCourseProgress(prisma, user.id, course.id);
    courseProgress = await prisma.userCourseProgress.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
    });
  }

  const chapters = course.chapters.map((cc) => cc.chapter);

  return (
    <FrontToBackCourseView
      courseName={course.name}
      currentChapterId={courseProgress?.currentChapterId ?? null}
      streak={user.currentStreak}
      freezeCount={user.freezeCount}
      xpTotal={user.xpTotal}
      chapters={chapters.map((chapter) => ({
        id: chapter.id,
        number: chapter.number,
        bookName: chapter.book.name,
        verseCount: chapter._count.verses,
        exerciseCount: chapter._count.exercises,
        wordCount: chapter.verses.reduce((sum, v) => sum + v.text.split(/\s+/).length, 0),
        completed: chapter.progress[0]?.completed ?? false,
        bestScore: chapter.progress[0]?.bestScore ?? null,
      }))}
    />
  );
}
