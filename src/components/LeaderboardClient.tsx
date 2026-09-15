"use client";

import { useEffect, useState } from "react";
import type { LeagueTier } from "@prisma/client";
import { TIER_LABELS, TIER_ICONS } from "@/lib/leagues";

type Zone = "PROMOTION" | "SAFE" | "RELEGATION" | null;

interface LeagueEntry {
  rank: number;
  userId: string;
  handle: string;
  xp: number;
  tier: LeagueTier;
  isMe: boolean;
  zone: Zone;
}

interface XpGap {
  toward: "PROMOTION" | "SAFETY" | "FIRST_PLACE";
  xp: number;
}

interface LeagueData {
  scope: "league" | "friends";
  myTier: LeagueTier;
  promoteCount: number;
  demoteCount: number;
  hasActivityThisWeek: boolean;
  xpGap: XpGap | null;
  entries: LeagueEntry[];
}

interface NationalEntry {
  rank: number;
  userId: string;
  handle: string;
  xpTotal: number;
  currentStreak: number;
  tier: LeagueTier | null;
  isMe: boolean;
}

interface NationalData {
  scope: "national";
  entries: NationalEntry[];
  me: NationalEntry | null;
}

const MEDALS = ["🥇", "🥈", "🥉"];

const ZONE_DOT: Record<Exclude<Zone, null>, string> = {
  PROMOTION: "🟢",
  SAFE: "⚪",
  RELEGATION: "🔴",
};

export default function LeaderboardClient() {
  const [scope, setScope] = useState<"league" | "friends" | "national">("league");
  const [data, setData] = useState<LeagueData | NationalData | null>(null);

  useEffect(() => {
    setData(null);
    fetch(`/api/leaderboard?scope=${scope}`)
      .then((r) => r.json())
      .then(setData);
  }, [scope]);

  const leagueData = data && data.scope !== "national" ? (data as LeagueData) : null;
  const nationalData = data && data.scope === "national" ? (data as NationalData) : null;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">
            {scope === "league" && leagueData ? (
              <>
                {TIER_ICONS[leagueData.myTier]} {TIER_LABELS[leagueData.myTier]}
              </>
            ) : scope === "national" ? (
              "🇳🇱 Nederlandse ranglijst"
            ) : (
              "Competitie"
            )}
          </h1>
          {scope === "league" && <p className="text-sm text-slate-400 dark:text-slate-500">Deze week</p>}
        </div>
        <div className="flex bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-1 flex-wrap">
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
          <button
            onClick={() => setScope("national")}
            className={`px-4 py-1.5 rounded-xl text-sm font-bold ${
              scope === "national" ? "bg-brand-500 text-white" : "text-slate-500 dark:text-slate-300"
            }`}
          >
            Nederlandse ranglijst
          </button>
        </div>
      </div>

      {scope === "league" && leagueData && (
        <p className="text-sm text-slate-400 dark:text-slate-500">
          De bovenste {leagueData.promoteCount} promoveren aan het einde van de week, de onderste {leagueData.demoteCount}{" "}
          degraderen.
        </p>
      )}

      {scope === "league" && leagueData?.xpGap && (
        <div className="card !py-3 bg-brand-50 dark:bg-slate-700 border-brand-100 dark:border-slate-600">
          <p className="font-bold text-brand-700 dark:text-brand-300">
            {leagueData.xpGap.toward === "SAFETY" && `Nog ${leagueData.xpGap.xp} XP tot veiligheid.`}
            {leagueData.xpGap.toward === "PROMOTION" && `Nog ${leagueData.xpGap.xp} XP tot promotie.`}
            {leagueData.xpGap.toward === "FIRST_PLACE" && `Nog ${leagueData.xpGap.xp} XP tot de eerste plek!`}
          </p>
        </div>
      )}

      {!data && <p className="text-slate-400">Laden...</p>}

      {leagueData && leagueData.entries.length === 0 && (
        <p className="text-slate-400">Nog geen XP verdiend deze week. Doe een les om op de ranglijst te komen!</p>
      )}

      {leagueData && leagueData.entries.length > 0 && (
        <div className="card flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
          {leagueData.entries.map((e) => (
            <div
              key={e.userId}
              className={`flex items-center justify-between py-3 px-2 rounded-xl ${
                e.isMe ? "bg-brand-50 dark:bg-slate-700 font-extrabold" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 text-center text-lg">{MEDALS[e.rank - 1] ?? e.rank}</span>
                {e.zone && (
                  <span title={e.zone === "PROMOTION" ? "Promotiezone" : e.zone === "RELEGATION" ? "Degradatiezone" : "Veilige zone"}>
                    {ZONE_DOT[e.zone]}
                  </span>
                )}
                <span className="dark:text-slate-100">
                  {e.handle} {e.isMe && <span className="text-brand-500 dark:text-brand-300">(jij)</span>}
                </span>
              </div>
              <span className="text-gold-600 dark:text-gold-400 font-bold">{e.xp} XP</span>
            </div>
          ))}
        </div>
      )}

      {nationalData && (
        <div className="flex flex-col gap-3">
          <div className="card flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
            {nationalData.entries.map((e) => (
              <NationalRow key={e.userId} e={e} />
            ))}
          </div>
          {nationalData.me && (
            <div className="card !py-3 bg-brand-50 dark:bg-slate-700">
              <NationalRow e={nationalData.me} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NationalRow({ e }: { e: NationalEntry }) {
  return (
    <div className={`flex items-center justify-between py-3 px-2 rounded-xl ${e.isMe ? "font-extrabold" : ""}`}>
      <div className="flex items-center gap-3">
        <span className="w-8 text-center text-lg">{MEDALS[e.rank - 1] ?? `#${e.rank}`}</span>
        <span className="dark:text-slate-100">
          {e.handle} {e.isMe && <span className="text-brand-500 dark:text-brand-300">(jij)</span>}
        </span>
        {e.tier && <span title={TIER_LABELS[e.tier]}>{TIER_ICONS[e.tier]}</span>}
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-orange-500 font-bold">🔥 {e.currentStreak}</span>
        <span className="text-gold-600 dark:text-gold-400 font-bold">⭐ {e.xpTotal}</span>
      </div>
    </div>
  );
}
