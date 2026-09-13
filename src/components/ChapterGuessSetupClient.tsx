"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Level = "BEGINNER" | "ADVANCED" | "EXPERT";

const LEVELS: { value: Level; label: string; description: string }[] = [
  {
    value: "BEGINNER",
    label: "Beginner",
    description: "Kies uit 4 hoofdstukken. Goed = 5 XP + een hint. Hints mogen ingezet worden.",
  },
  {
    value: "ADVANCED",
    label: "Gevorderd",
    description: "Zelf boek + hoofdstuk kiezen en bevestigen. Hints mogen ingezet worden.",
  },
  {
    value: "EXPERT",
    label: "Expert",
    description: "Net als Gevorderd, maar zonder hints.",
  },
];

const QUESTION_COUNTS = [5, 10, 15] as const;

export default function ChapterGuessSetupClient() {
  const router = useRouter();
  const [level, setLevel] = useState<Level>("BEGINNER");
  const [questionCount, setQuestionCount] = useState<(typeof QUESTION_COUNTS)[number]>(5);
  const [starting, setStarting] = useState<"solo" | "live" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function playSolo() {
    setError(null);
    setStarting("solo");
    const res = await fetch("/api/chapter-guess/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, questionCount }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Kon geen spel starten.");
      setStarting(null);
      return;
    }
    router.push(`/chapter-guess/solo/${data.gameId}`);
  }

  async function playWithFriends() {
    setError(null);
    setStarting("live");
    const res = await fetch("/api/live/create-chapter-guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, questionCount }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Kon geen spel starten.");
      setStarting(null);
      return;
    }
    router.push(`/live/${data.code}`);
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">🔎 Raad het hoofdstuk</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Je krijgt het eerste vers van een hoofdstuk te lezen — raad daarna welk hoofdstuk het is.
        </p>
      </div>

      <div className="card flex flex-col gap-3">
        <h2 className="font-extrabold dark:text-slate-100">Niveau</h2>
        <div className="flex flex-col gap-2">
          {LEVELS.map((l) => (
            <button
              key={l.value}
              onClick={() => setLevel(l.value)}
              className={`text-left rounded-xl border-2 px-4 py-3 transition-colors ${
                level === l.value
                  ? "border-brand-500 bg-brand-50 dark:bg-slate-700"
                  : "border-slate-200 dark:border-slate-600 hover:border-brand-300"
              }`}
            >
              <p className="font-extrabold dark:text-slate-100">{l.label}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{l.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="card flex flex-col gap-3">
        <h2 className="font-extrabold dark:text-slate-100">Aantal vragen</h2>
        <div className="flex gap-3">
          {QUESTION_COUNTS.map((n) => (
            <button
              key={n}
              onClick={() => setQuestionCount(n)}
              className={`flex-1 rounded-xl border-2 py-3 font-extrabold transition-colors ${
                questionCount === n
                  ? "border-brand-500 bg-brand-50 dark:bg-slate-700 text-brand-700 dark:text-brand-300"
                  : "border-slate-200 dark:border-slate-600 hover:border-brand-300 dark:text-slate-100"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button className="btn-primary flex-1" disabled={starting !== null} onClick={playSolo}>
          {starting === "solo" ? "Bezig..." : "Alleen spelen"}
        </button>
        <button className="btn-secondary flex-1" disabled={starting !== null} onClick={playWithFriends}>
          {starting === "live" ? "Bezig..." : "Met vrienden (live)"}
        </button>
      </div>
      {error && <p className="text-red-600 dark:text-red-400 text-sm font-semibold">{error}</p>}
    </div>
  );
}
