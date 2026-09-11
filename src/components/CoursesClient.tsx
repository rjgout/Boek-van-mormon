"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CourseView {
  id: string;
  slug: string;
  type: "FRONT_TO_BACK" | "FREE_CHOICE" | "BY_BOOK";
  name: string;
  description: string | null;
  totalChapters: number;
  completedCount: number;
  isActive: boolean;
  currentChapter: { id: string; bookName: string; number: number } | null;
}

const TYPE_LABELS: Record<CourseView["type"], string> = {
  FRONT_TO_BACK: "Van voor naar achter",
  FREE_CHOICE: "Vrije keuze",
  BY_BOOK: "Per boek",
};

export default function CoursesClient() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseView[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/courses")
      .then(async (r) => {
        const data = await r.json().catch(() => null);
        if (!r.ok) {
          throw new Error(data?.error ?? `Er ging iets mis (${r.status}).`);
        }
        return data;
      })
      .then((d) => setCourses(d.courses ?? []))
      .catch((e) => setLoadError(e instanceof Error ? e.message : "Er ging iets mis."));
  }, []);

  async function activate(courseId: string) {
    setActivatingId(courseId);
    const res = await fetch(`/api/courses/${courseId}/activate`, { method: "POST" });
    setActivatingId(null);
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    }
  }

  if (loadError) {
    return (
      <div className="max-w-md mx-auto card text-center flex flex-col gap-3">
        <p className="text-red-600 dark:text-red-400 font-semibold">{loadError}</p>
        <button className="btn-secondary self-center" onClick={() => window.location.reload()}>
          Opnieuw proberen
        </button>
      </div>
    );
  }

  if (!courses) {
    return <p className="text-center text-slate-400 dark:text-slate-500">Laden...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">Cursussen</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Kies hoe je door het Boek van Mormon wil gaan. Je voortgang per cursus blijft bewaard als je wisselt.
        </p>
      </div>

      {courses.length === 0 && (
        <div className="card text-center flex flex-col gap-2">
          <p className="font-bold dark:text-slate-100">Nog geen cursussen beschikbaar</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Er is nog geen content geïmporteerd (of de admin moet <code>npm run db:seed</code> nog (opnieuw) draaien
            na een update) — cursussen worden daarbij automatisch aangemaakt.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {courses.map((course) => {
          const pct =
            course.totalChapters > 0 ? Math.round((course.completedCount / course.totalChapters) * 100) : 0;
          return (
            <div key={course.id} className={`card flex flex-col gap-3 ${course.isActive ? "ring-2 ring-brand-400" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">
                    {TYPE_LABELS[course.type]}
                  </p>
                  <h2 className="font-extrabold text-lg dark:text-slate-100">{course.name}</h2>
                  {course.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">{course.description}</p>
                  )}
                </div>
                {course.isActive && (
                  <span className="text-xs font-bold uppercase text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-slate-700 rounded-full px-3 py-1">
                    Actief
                  </span>
                )}
              </div>

              {course.type !== "FREE_CHOICE" && course.totalChapters > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-brand-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {course.completedCount} / {course.totalChapters} hoofdstukken voltooid
                    {course.currentChapter &&
                      ` — volgende: ${course.currentChapter.bookName} ${course.currentChapter.number}`}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                {course.isActive ? (
                  <Link href="/dashboard" className="btn-primary self-start">
                    Ga verder →
                  </Link>
                ) : (
                  <button
                    className="btn-secondary self-start"
                    disabled={activatingId === course.id}
                    onClick={() => activate(course.id)}
                  >
                    {activatingId === course.id ? "Bezig..." : "Kies deze cursus"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
