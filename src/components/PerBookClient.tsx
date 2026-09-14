"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BookCourseView {
  id: string;
  type: string;
  name: string;
  totalChapters: number;
  completedCount: number;
  isActive: boolean;
}

export default function PerBookClient() {
  const [courses, setCourses] = useState<BookCourseView[] | null>(null);
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
      .then((d) => setCourses((d.courses ?? []).filter((c: BookCourseView) => c.type === "BY_BOOK")))
      .catch((e) => setLoadError(e instanceof Error ? e.message : "Er ging iets mis."));
  }, []);

  async function activate(courseId: string) {
    setActivatingId(courseId);
    const res = await fetch(`/api/courses/${courseId}/activate`, { method: "POST" });
    if (res.ok) {
      // Zelfde reden als in CoursesClient: harde navigatie i.p.v.
      // router.push, om altijd verse serverdata te krijgen.
      window.location.href = `/courses/${courseId}`;
      return;
    }
    setActivatingId(null);
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
        <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">Per boek</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Kies een boek om daar hoofdstuk voor hoofdstuk doorheen te gaan.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {courses.map((course) => {
          const pct =
            course.totalChapters > 0 ? Math.round((course.completedCount / course.totalChapters) * 100) : 0;
          return (
            <div
              key={course.id}
              className={`card flex flex-col gap-3 ${course.isActive ? "ring-2 ring-brand-400" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-extrabold text-lg dark:text-slate-100">{course.name}</h2>
                {course.isActive && (
                  <span className="text-xs font-bold uppercase text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-slate-700 rounded-full px-3 py-1">
                    Actief
                  </span>
                )}
              </div>

              {course.totalChapters > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-brand-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {course.completedCount} / {course.totalChapters} hoofdstukken voltooid
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                {course.isActive ? (
                  <Link href={`/courses/${course.id}`} className="btn-primary self-start">
                    Ga verder →
                  </Link>
                ) : (
                  <button
                    className="btn-secondary self-start"
                    disabled={activatingId === course.id}
                    onClick={() => activate(course.id)}
                  >
                    {activatingId === course.id ? "Bezig..." : "Kies dit boek"}
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
