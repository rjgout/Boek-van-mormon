import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { isEmailConfigured } from "@/lib/email";
import { advanceCourseProgress } from "@/lib/courses";
import SearchBar from "@/components/SearchBar";
import ActiveGamesBanner from "@/components/ActiveGamesBanner";

const WORDS_PER_MINUTE = 130; // rustig lees-/nadenktempo

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.mustChangePassword) redirect("/change-password");
  // Alleen afdwingen als er een werkende e-mailconfiguratie is — anders zou
  // niemand ooit voorbij deze pagina komen (zie /adminbackend voor de
  // e-mailinstellingen).
  if (!user.emailVerifiedAt && !user.isDemoSeed && (await isEmailConfigured())) {
    redirect("/verify-email");
  }

  // "Van voor naar achter", de podcastcursus en de kindercursus hebben
  // allemaal al hun eigen pagina (/courses/[courseId]); de overige
  // cursustypes vallen nog terug op deze generieke weergave hieronder, tot
  // ze ook een eigen pagina krijgen (zie de cursus-voor-cursus-migratie).
  if (user.activeCourseId) {
    const activeCourseType = await prisma.course.findUnique({
      where: { id: user.activeCourseId },
      select: { type: true },
    });
    if (
      activeCourseType?.type === "FRONT_TO_BACK" ||
      activeCourseType?.type === "PODCAST" ||
      activeCourseType?.type === "KIDS"
    ) {
      redirect(`/courses/${user.activeCourseId}`);
    }
  }

  const [books, pendingRequests, activeCourse] = await Promise.all([
    prisma.book.findMany({
      orderBy: { order: "asc" },
      include: {
        chapters: {
          orderBy: { order: "asc" },
          include: {
            verses: { select: { text: true } },
            _count: { select: { verses: true, exercises: true } },
            progress: { where: { userId: user.id } },
          },
        },
      },
    }),
    prisma.friendship.count({ where: { receiverId: user.id, status: "PENDING" } }),
    user.activeCourseId ? prisma.course.findUnique({ where: { id: user.activeCourseId } }) : null,
  ]);

  const allChapters = books.flatMap((book) =>
    book.chapters.map((chapter) => ({ book, chapter, progress: chapter.progress[0] }))
  );

  // "Vandaag" volgt de actieve cursus (behalve bij vrije keuze, waar je zelf
  // kiest): het volgende hoofdstuk in die cursus, of anders — geen actieve
  // cursus, cursus uitgelezen, of vrije keuze — het eerste onvoltooide
  // hoofdstuk over alles heen.
  let todayChapterId: string | null = null;
  if (activeCourse && activeCourse.type !== "FREE_CHOICE") {
    let courseProgress = await prisma.userCourseProgress.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: activeCourse.id } },
    });
    if (!courseProgress) {
      await advanceCourseProgress(prisma, user.id, activeCourse.id);
      courseProgress = await prisma.userCourseProgress.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: activeCourse.id } },
      });
    }
    todayChapterId = courseProgress?.currentChapterId ?? null;
  }

  const todayEntry =
    (todayChapterId && allChapters.find((c) => c.chapter.id === todayChapterId)) ||
    allChapters.find((c) => !(c.progress?.completed ?? false)) ||
    allChapters[allChapters.length - 1];
  const todayWordCount = todayEntry?.chapter.verses.reduce((sum, v) => sum + v.text.split(/\s+/).length, 0) ?? 0;
  const estimatedMinutes = Math.max(1, Math.round(todayWordCount / WORDS_PER_MINUTE));
  const xpAvailable = (todayEntry?.chapter._count.exercises ?? 0) * 10;
  const allDone = allChapters.length > 0 && allChapters.every((c) => c.progress?.completed);

  let previousCompleted = true;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">Hoi {user.displayName} 👋</h1>
          <div className="flex gap-4 text-center">
            <MiniStat icon="🔥" value={user.currentStreak} label="Streak" color="text-orange-500" />
            <MiniStat icon="🧊" value={user.freezeCount} label="Freezes" color="text-ice-600" />
            <MiniStat icon="⭐" value={user.xpTotal} label="XP" color="text-gold-600" />
          </div>
        </div>

        <SearchBar />

        <ActiveGamesBanner />

        {todayEntry && !allDone ? (
          <div className="card bg-gradient-to-br from-brand-500 to-brand-600 text-white flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-brand-100 font-bold uppercase text-xs tracking-wide">
                Vandaag{activeCourse ? ` — ${activeCourse.name}` : ""}
              </p>
              <Link href="/courses" className="text-brand-100 text-xs font-bold underline underline-offset-2">
                Wissel cursus
              </Link>
            </div>
            <h2 className="text-2xl font-extrabold">
              📖 {todayEntry.book.name} {todayEntry.chapter.number}
            </h2>
            <p className="text-brand-100">⏱️ ongeveer {estimatedMinutes} minuten · ⭐ {xpAvailable} XP te verdienen</p>
            <Link
              href={`/lesson/${todayEntry.chapter.id}`}
              className="btn-primary self-start !bg-white !text-brand-700 !shadow-[0_4px_0_0_theme(colors.brand.800)] hover:!bg-brand-50"
            >
              Lees verder →
            </Link>
          </div>
        ) : (
          allDone && (
            <div className="card text-center">
              <p className="font-extrabold text-lg dark:text-slate-100">🎉 Je hebt alle beschikbare hoofdstukken voltooid!</p>
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
          {pendingRequests > 0 && (
            <Link href="/friends" className="btn-secondary !px-3 !py-2">
              👥 {pendingRequests} openstaand vriendschapsverzoek{pendingRequests > 1 ? "en" : ""}
            </Link>
          )}
        </div>
      </div>

      {books.map((book) => (
        <section key={book.id}>
          <h2 className="text-xl font-extrabold text-brand-700 dark:text-brand-300 mb-4">{book.name}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {book.chapters.map((chapter) => {
              const progress = chapter.progress[0];
              const completed = progress?.completed ?? false;
              const locked = !previousCompleted;
              previousCompleted = completed;

              return (
                <Link
                  key={chapter.id}
                  href={locked ? "#" : `/lesson/${chapter.id}`}
                  aria-disabled={locked}
                  className={`card flex items-center gap-4 transition ${
                    locked ? "opacity-50 pointer-events-none" : "hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  <div
                    className={`h-12 w-12 shrink-0 rounded-full flex items-center justify-center text-xl font-extrabold ${
                      completed
                        ? "bg-brand-500 text-white"
                        : locked
                        ? "bg-slate-100 dark:bg-slate-700 text-slate-400"
                        : "bg-gold-400 text-white"
                    }`}
                  >
                    {completed ? "✓" : locked ? "🔒" : chapter.number}
                  </div>
                  <div>
                    <div className="font-extrabold dark:text-slate-100">
                      {book.name} {chapter.number}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      {chapter._count.verses} verzen{progress ? ` · beste score ${progress.bestScore}%` : ""}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function MiniStat({ icon, value, label, color }: { icon: string; value: number; label: string; color: string }) {
  return (
    <div>
      <div className={`text-2xl font-extrabold ${color}`}>
        {icon} {value}
      </div>
      <div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase">{label}</div>
    </div>
  );
}
