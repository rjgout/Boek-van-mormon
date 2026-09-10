"use client";

import { useEffect, useState } from "react";
import type { LeagueTier } from "@prisma/client";
import { TIER_LABELS, TIER_ICONS } from "@/lib/leagues";

interface Entry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  xp: number;
  tier: LeagueTier;
  isMe: boolean;
}

interface LeaderboardData {
  myTier: LeagueTier;
  hasActivityThisWeek: boolean;
  entries: Entry[];
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardClient() {
  const [scope, setScope] = useState<"league" | "friends">("league");
  const [data, setData] = useState<LeaderboardData | null>(null);

  useEffect(() => {
    setData(null);
    fetch(`/api/leaderboard?scope=${scope}`)
      .then((r) => r.json())
      .then(setData);
  }, [scope]);

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">
          {scope === "league" && data ? (
            <>
              {TIER_ICONS[data.myTier]} {TIER_LABELS[data.myTier]}
            </>
          ) : (
            "Competitie"
          )}
        </h1>
        <div className="flex bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-1">
          <button
            onClick={() => setScope("league")}
            className={`px-4 py-1.5 rounded-xl text-sm font-bold ${
              scope === "league" ? "bg-brand-500 text-white" : "text-slate-500 dark:text-slate-300"
            }`}
          >
            Divisie
          </button>
          <button
            onClick={() => setScope("friends")}
            className={`px-4 py-1.5 rounded-xl text-sm font-bold ${
              scope === "friends" ? "bg-brand-500 text-white" : "text-slate-500 dark:text-slate-300"
            }`}
          >
            Vrienden
          </button>
        </div>
      </div>

      {scope === "league" && (
        <p className="text-sm text-slate-400 dark:text-slate-500">
          De bovenste {3} promoveren aan het einde van de week, de onderste {3} degraderen.
        </p>
      )}

      {!data && <p className="text-slate-400">Laden...</p>}
      {data && data.entries.length === 0 && (
        <p className="text-slate-400">Nog geen XP verdiend deze week. Doe een les om op de ranglijst te komen!</p>
      )}

      {data && data.entries.length > 0 && (
        <div className="card flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
          {data.entries.map((e) => (
            <div
              key={e.userId}
              className={`flex items-center justify-between py-3 px-2 rounded-xl ${
                e.isMe ? "bg-brand-50 dark:bg-slate-700 font-extrabold" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 text-center text-lg">{MEDALS[e.rank - 1] ?? e.rank}</span>
                <span className="dark:text-slate-100">
                  {e.displayName} {e.isMe && <span className="text-brand-500 dark:text-brand-300">(jij)</span>}
                </span>
              </div>
              <span className="text-gold-600 dark:text-gold-400 font-bold">{e.xp} XP</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
