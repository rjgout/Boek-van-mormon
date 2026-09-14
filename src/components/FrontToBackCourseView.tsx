import Link from "next/link";

const WORDS_PER_MINUTE = 130; // rustig lees-/nadenktempo

interface ChapterView {
  id: string;
  number: number;
  bookName: string;
  verseCount: number;
  exerciseCount: number;
  wordCount: number;
  completed: boolean;
  bestScore: number | null;
}

interface Props {
  courseName: string;
  currentChapterId: string | null;
  chapters: ChapterView[];
}

export default function FrontToBackCourseView({ courseName, currentChapterId, chapters }: Props) {
  const allDone = chapters.length > 0 && chapters.every((c) => c.completed);
  const todayChapter =
    (currentChapterId && chapters.find((c) => c.id === currentChapterId)) ||
    chapters.find((c) => !c.completed) ||
    chapters[chapters.length - 1];
  const estimatedMinutes = todayChapter ? Math.max(1, Math.round(todayChapter.wordCount / WORDS_PER_MINUTE)) : 0;
  const xpAvailable = (todayChapter?.exerciseCount ?? 0) * 10;

  let previousCompleted = true;
  let lastBookName: string | null = null;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">{courseName}</h1>

        {todayChapter && !allDone ? (
          <div className="card bg-gradient-to-br from-brand-500 to-brand-600 text-white flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-brand-100 font-bold uppercase text-xs tracking-wide">Vandaag</p>
              <Link href="/courses" className="text-brand-100 text-xs font-bold underline underline-offset-2">
                Wissel cursus
              </Link>
            </div>
            <h2 className="text-2xl font-extrabold">
              📖 {todayChapter.bookName} {todayChapter.number}
            </h2>
            <p className="text-brand-100">⏱️ ongeveer {estimatedMinutes} minuten · ⭐ {xpAvailable} XP te verdienen</p>
            <Link
              href={`/lesson/${todayChapter.id}`}
              className="btn-primary self-start !bg-white !text-brand-700 !shadow-[0_4px_0_0_theme(colors.brand.800)] hover:!bg-brand-50"
            >
              Lees verder →
            </Link>
          </div>
        ) : (
          allDone && (
            <div className="card text-center">
              <p className="font-extrabold text-lg dark:text-slate-100">🎉 Je hebt deze cursus helemaal voltooid!</p>
            </div>
          )
        )}

        <div className="flex gap-3 flex-wrap text-sm">
          <Link href="/practice" className="btn-secondary !px-3 !py-2">
            ⚡ Snelle ronde
          </Link>
          <Link href="/bookmarks" className="btn-secondary !px-3 !py-2">
            🔖 Bladwijzers
          </Link>
          <Link href="/competition" className="btn-secondary !px-3 !py-2">
            🏆 Naar de competitie
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {chapters.map((chapter) => {
          const locked = !previousCompleted;
          previousCompleted = chapter.completed;
          const showHeading = chapter.bookName !== lastBookName;
          lastBookName = chapter.bookName;

          return (
            <div key={chapter.id} className="contents">
              {showHeading && (
                <h2 className="text-xl font-extrabold text-brand-700 dark:text-brand-300 -mb-4 first:mb-0">
                  {chapter.bookName}
                </h2>
              )}
              <Link
                href={locked ? "#" : `/lesson/${chapter.id}`}
                aria-disabled={locked}
                className={`card flex items-center gap-4 transition max-w-sm ${
                  locked ? "opacity-50 pointer-events-none" : "hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <div
                  className={`h-12 w-12 shrink-0 rounded-full flex items-center justify-center text-xl font-extrabold ${
                    chapter.completed
                      ? "bg-brand-500 text-white"
                      : locked
                        ? "bg-slate-100 dark:bg-slate-700 text-slate-400"
                        : "bg-gold-400 text-white"
                  }`}
                >
                  {chapter.completed ? "✓" : locked ? "🔒" : chapter.number}
                </div>
                <div>
                  <div className="font-extrabold dark:text-slate-100">
                    {chapter.bookName} {chapter.number}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {chapter.verseCount} verzen{chapter.bestScore !== null ? ` · beste score ${chapter.bestScore}%` : ""}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
