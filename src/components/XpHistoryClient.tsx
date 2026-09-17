"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type XPReason =
  | "LESSON_COMPLETED"
  | "PERFECT_SCORE"
  | "LIVE_GAME_PLAYED"
  | "LIVE_GAME_WON"
  | "ACHIEVEMENT"
  | "QUICK_PRACTICE"
  | "PODCAST_LESSON_COMPLETED"
  | "KIDS_STORY_COMPLETED"
  | "HINT_PURCHASED"
  | "FREEZE_PURCHASED"
  | "CHAPTER_GUESS_COMPLETED"
  | "WORD_GAME_WON"
  | "INTRO_LESSON_COMPLETED";

interface XpTransaction {
  id: string;
  amount: number;
  reason: XPReason;
  createdAt: string;
}

const REASON_LABELS: Record<XPReason, string> = {
  LESSON_COMPLETED: "Les afgerond",
  PERFECT_SCORE: "Perfecte score",
  LIVE_GAME_PLAYED: "Live quiz gespeeld",
  LIVE_GAME_WON: "Live quiz gewonnen",
  ACHIEVEMENT: "Achievement behaald",
  QUICK_PRACTICE: "Snelle ronde",
  PODCAST_LESSON_COMPLETED: "Podcastles afgerond",
  KIDS_STORY_COMPLETED: "Kinderverhaal afgerond",
  HINT_PURCHASED: "Hint gekocht",
  FREEZE_PURCHASED: "Streak freeze gekocht",
  CHAPTER_GUESS_COMPLETED: "Raad het hoofdstuk",
  WORD_GAME_WON: "Woordspel gewonnen",
  INTRO_LESSON_COMPLETED: "Introductieles afgerond",
};

const REASON_ICONS: Record<XPReason, string> = {
  LESSON_COMPLETED: "📖",
  PERFECT_SCORE: "🎯",
  LIVE_GAME_PLAYED: "⚡",
  LIVE_GAME_WON: "🏆",
  ACHIEVEMENT: "🏅",
  QUICK_PRACTICE: "✍️",
  PODCAST_LESSON_COMPLETED: "🎙️",
  KIDS_STORY_COMPLETED: "🧒",
  HINT_PURCHASED: "💡",
  FREEZE_PURCHASED: "🧊",
  CHAPTER_GUESS_COMPLETED: "🔍",
  WORD_GAME_WON: "🔤",
  INTRO_LESSON_COMPLETED: "🧭",
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(
    new Date(iso)
  );
}

export default function XpHistoryClient() {
  const [transactions, setTransactions] = useState<XpTransaction[]>([]);
  const [xpTotal, setXpTotal] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load(skip: number) {
    fetch(`/api/xp-history?skip=${skip}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Kon de XP-geschiedenis niet laden.");
        setXpTotal(data.xpTotal);
        setHasMore(data.hasMore);
        setTransactions((prev) => (skip === 0 ? data.transactions : [...prev, ...data.transactions]));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Er ging iets mis."))
      .finally(() => setLoadingMore(false));
  }

  useEffect(() => {
    load(0);
  }, []);

  function loadMore() {
    setLoadingMore(true);
    load(transactions.length);
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto card text-center flex flex-col gap-3">
        <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
        <Link href="/dashboard" className="btn-secondary self-center">
          Terug
        </Link>
      </div>
    );
  }

  if (xpTotal === null) {
    return <p className="text-center text-slate-400 dark:text-slate-500">Laden...</p>;
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">⭐ Ervaringspunten</h1>
      </div>

      <div className="card flex items-center gap-6">
        <div className="text-6xl" aria-hidden>
          ⭐
        </div>
        <div>
          <div className="text-5xl font-extrabold text-gold-600 dark:text-gold-400 leading-none">{xpTotal}</div>
          <div className="text-slate-500 dark:text-slate-400 font-bold mt-1">XP verzameld</div>
        </div>
      </div>

      <div className="card flex flex-col gap-1">
        <h2 className="font-extrabold text-lg mb-2 dark:text-slate-100">Geschiedenis</h2>
        {transactions.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500">Nog geen XP verdiend.</p>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0" aria-hidden>
                    {REASON_ICONS[tx.reason]}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate dark:text-slate-100">{REASON_LABELS[tx.reason]}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>
                <span
                  className={`font-extrabold shrink-0 ${tx.amount >= 0 ? "text-brand-600 dark:text-brand-300" : "text-red-500 dark:text-red-400"}`}
                >
                  {tx.amount >= 0 ? "+" : ""}
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        )}

        {hasMore && (
          <button className="btn-secondary self-center mt-3" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? "Bezig..." : "Meer laden"}
          </button>
        )}
      </div>
    </div>
  );
}
