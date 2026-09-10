"use client";

import { useEffect, useState } from "react";

interface Entry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  xp: number;
  isMe: boolean;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardClient() {
  const [scope, setScope] = useState<"global" | "friends">("global");
  const [entries, setEntries] = useState<Entry[] | null>(null);

  useEffect(() => {
    setEntries(null);
    fetch(`/api/leaderboard?scope=${scope}`)
      .then((r) => r.json())
      .then((d) => setEntries(d.entries));
  }, [scope]);

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-brand-800">Wekelijkse competitie</h1>
        <div className="flex bg-white rounded-2xl border border-slate-200 p-1">
          <button
            onClick={() => setScope("global")}
            className={`px-4 py-1.5 rounded-xl text-sm font-bold ${scope === "global" ? "bg-brand-500 text-white" : "text-slate-500"}`}
          >
            Iedereen
          </button>
          <button
            onClick={() => setScope("friends")}
            className={`px-4 py-1.5 rounded-xl text-sm font-bold ${scope === "friends" ? "bg-brand-500 text-white" : "text-slate-500"}`}
          >
            Vrienden
          </button>
        </div>
      </div>

      {!entries && <p className="text-slate-400">Laden...</p>}
      {entries && entries.length === 0 && (
        <p className="text-slate-400">Nog geen XP verdiend deze week. Doe een les om op de ranglijst te komen!</p>
      )}

      {entries && entries.length > 0 && (
        <div className="card flex flex-col divide-y divide-slate-100">
          {entries.map((e) => (
            <div
              key={e.userId}
              className={`flex items-center justify-between py-3 px-2 rounded-xl ${e.isMe ? "bg-brand-50 font-extrabold" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 text-center text-lg">{MEDALS[e.rank - 1] ?? e.rank}</span>
                <span>
                  {e.displayName} {e.isMe && <span className="text-brand-500">(jij)</span>}
                </span>
              </div>
              <span className="text-gold-600 font-bold">{e.xp} XP</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
