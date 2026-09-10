import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const books = await prisma.book.findMany({
    orderBy: { order: "asc" },
    include: {
      chapters: {
        orderBy: { order: "asc" },
        include: {
          _count: { select: { verses: true } },
          progress: { where: { userId: user.id } },
        },
      },
    },
  });

  let previousCompleted = true;

  return (
    <div className="flex flex-col gap-10">
      <div className="card flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-800">Hoi {user.displayName} 👋</h1>
          <p className="text-slate-500">Klaar voor je volgende les?</p>
        </div>
        <div className="flex gap-4 text-center">
          <div>
            <div className="text-2xl font-extrabold text-orange-500">🔥 {user.currentStreak}</div>
            <div className="text-xs text-slate-400 font-bold uppercase">Streak</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-ice-600">🧊 {user.freezeCount}</div>
            <div className="text-xs text-slate-400 font-bold uppercase">Freezes</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gold-600">⭐ {user.xpTotal}</div>
            <div className="text-xs text-slate-400 font-bold uppercase">XP</div>
          </div>
        </div>
      </div>

      {books.map((book) => (
        <section key={book.id}>
          <h2 className="text-xl font-extrabold text-brand-700 mb-4">{book.name}</h2>
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
                        ? "bg-slate-100 text-slate-400"
                        : "bg-gold-400 text-white"
                    }`}
                  >
                    {completed ? "✓" : locked ? "🔒" : chapter.number}
                  </div>
                  <div>
                    <div className="font-extrabold">
                      {book.name} {chapter.number}
                    </div>
                    <div className="text-xs text-slate-400">
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
