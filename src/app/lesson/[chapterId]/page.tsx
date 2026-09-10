import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import LessonFlow from "@/components/LessonFlow";

export default async function LessonPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { chapterId } = await params;
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: {
      book: true,
      verses: { orderBy: { number: "asc" } },
      exercises: { orderBy: { order: "asc" } },
    },
  });
  if (!chapter) redirect("/dashboard");

  const exercises = chapter.exercises.map((e) => ({
    id: e.id,
    type: e.type as "FILL_BLANK" | "WORD_BANK",
    verseRef: e.verseRef,
    prompt: e.prompt,
    blanks: (JSON.parse(e.answers) as string[]).length,
    wordBank: e.wordBank ? (JSON.parse(e.wordBank) as string[]) : undefined,
  }));

  return (
    <LessonFlow
      chapterId={chapter.id}
      bookName={chapter.book.name}
      chapterNumber={chapter.number}
      verses={chapter.verses.map((v) => ({ number: v.number, text: v.text }))}
      exercises={exercises}
    />
  );
}
