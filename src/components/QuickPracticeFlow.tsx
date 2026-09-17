"use client";

import { useState } from "react";
import Link from "next/link";
import { ExerciseCard, type Exercise } from "@/components/LessonFlow";
import { useActivityStatus } from "@/lib/useActivity";
import { announceXpChanged } from "@/lib/xpBroadcast";

interface Answer {
  exerciseId: string;
  given: string[];
}

interface Summary {
  correctCount: number;
  total: number;
  xpEarned: number;
  currentStreak: number;
  freezeCount: number;
  freezesEarned: number;
  freezeUsed: boolean;
  streakBroken: boolean;
  newAchievements: string[];
  alreadyStudiedToday: boolean;
}

export default function QuickPracticeFlow({ exercises }: { exercises: Exercise[] }) {
  useActivityStatus("✏️", "Aan het oefenen");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const current = exercises[index];

  async function finish(all: Answer[]) {
    setSubmitting(true);
    const res = await fetch("/api/practice/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: all }),
    });
    const data = await res.json();
    setSubmitting(false);
    setSummary(data);
    announceXpChanged();
  }

  function onDone(given: string[], _correct: boolean) {
    void _correct; // de server herberekent correctheid zelf bij het indienen
    const next = [...answers, { exerciseId: current.id, given }];
    setAnswers(next);
    if (index + 1 < exercises.length) {
      setIndex(index + 1);
    } else {
      finish(next);
    }
  }

  if (summary) {
    return (
      <div className="max-w-md mx-auto card flex flex-col items-center gap-4 text-center animate-pop">
        <div className="text-5xl">⚡</div>
        <h2 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">
          {summary.correctCount} / {summary.total} goed
        </h2>
        <p className="text-gold-600 dark:text-gold-400 font-extrabold text-lg">+{summary.xpEarned} XP</p>
        {!summary.alreadyStudiedToday && (
          <p className="text-orange-500 font-extrabold text-lg">🔥 {summary.currentStreak}</p>
        )}

        {summary.freezeUsed && (
          <p className="text-sm bg-ice-50 dark:bg-slate-700 text-ice-600 dark:text-ice-400 rounded-xl px-3 py-2">
            Je hebt een dag gemist, maar een streak freeze heeft je streak gered! 🧊
          </p>
        )}
        {summary.freezesEarned > 0 && (
          <p className="text-sm bg-gold-50 dark:bg-slate-700 text-gold-600 dark:text-gold-400 rounded-xl px-3 py-2">
            Mijlpaal gehaald! Je hebt {summary.freezesEarned} streak freeze{summary.freezesEarned > 1 ? "s" : ""} verdiend. 🧊
          </p>
        )}

        <Link href="/dashboard" className="btn-primary mt-2">
          Terug naar dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-brand-500 transition-all duration-300"
          style={{ width: `${Math.round((index / exercises.length) * 100)}%` }}
        />
      </div>
      <ExerciseCard key={current.id} exercise={current} onDone={onDone} disabled={submitting} />
    </div>
  );
}
