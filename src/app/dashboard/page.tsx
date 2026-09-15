import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { isEmailConfigured } from "@/lib/email";
import SearchBar from "@/components/SearchBar";

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
  // Nieuwe gebruikers krijgen eenmalig de onboarding-flow te zien (webapp,
  // reeks/XP/hints, vrienden, notificaties). Bestaande gebruikers zijn bij
  // de migratie al voorzien van een onboardingSeenAt (= hun createdAt), dus
  // deze redirect raakt alleen registraties van na die migratie. Handmatig
  // herstarten kan via de knop op de profielpagina.
  if (!user.onboardingSeenAt) redirect("/onboarding");

  // Elk cursustype heeft inmiddels zijn eigen pagina (/courses/[courseId]) —
  // alleen wie nog helemaal geen cursus geactiveerd heeft, valt terug op de
  // generieke weergave hieronder (het hele Boek van Mormon, ongeacht cursus).
  if (user.activeCourseId) {
    redirect(`/courses/${user.activeCourseId}`);
  }

  const [books, pendingRequests] = await Promise.all([
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
  ]);

  const allChapters = books.flatMap((book) =>
    book.chapters.map((chapter) => ({ book, chapter, progress: chapter.progress[0] }))
  );

  // Wordt alleen getoond zolang er geen cursus geactiveerd is (zie de
  // redirect hierboven) — dan is er ook geen cursus om "Vandaag" op te laten
  // volgen, dus gewoon het eerste onvoltooide hoofdstuk over alles heen.
  const todayEntry =
    allChapters.find((c) => !(c.progress?.completed ?? false)) ?? allChapters[allChapters.length - 1];
  const todayWordCount = todayEntry?.chapter.verses.reduce((sum, v) => sum + v.text.split(/\s+/).length, 0) ?? 0;
  const estimatedMinutes = Math.max(1, Math.round(todayWordCount / WORDS_PER_MINUTE));
  const xpAvailable = (todayEntry?.chapter._count.exercises ?? 0) * 10;
  const allDone = allChapters.length > 0 && allChapters.every((c) => c.progress?.completed);

  let previousCompleted = true;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">Hoi {user.handle} 👋</h1>

        <SearchBar />

        {todayEntry && !allDone ? (
          <div className="card bg-gradient-to-br from-brand-500 to-brand-600 text-white flex flex-col gap-3">
            <p className="text-brand-100 font-bold uppercase text-xs tracking-wide">Vandaag</p>
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
