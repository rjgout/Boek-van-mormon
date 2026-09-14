"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ActivityItem {
  kind: "challenge" | "scrabble" | "live";
  id: string;
  opponentName: string | null;
  label: string;
  link: string;
  myTurn: boolean | null;
}

interface ActivityStatus {
  invitesReceived: ActivityItem[];
  invitesSent: ActivityItem[];
  activeGames: ActivityItem[];
}

const KIND_ICON: Record<ActivityItem["kind"], string> = {
  challenge: "⚔️",
  scrabble: "🔤",
  live: "🎮",
};

// Compacte melding bovenaan /live ("Spelen") zodat je openstaande
// uitnodigingen en lopende spellen (Uitdagingen, Woordspel, Live spel) ook
// ziet zonder eerst naar die spelpagina's zelf te gaan. Toont niets zodra
// er niets openstaat.
export default function ActiveGamesBanner() {
  const [status, setStatus] = useState<ActivityStatus | null>(null);

  useEffect(() => {
    fetch("/api/activity-status")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setStatus(d))
      .catch(() => {});
  }, []);

  if (!status) return null;
  const { invitesReceived, invitesSent, activeGames } = status;
  if (invitesReceived.length === 0 && invitesSent.length === 0 && activeGames.length === 0) return null;

  return (
    <div className="card flex flex-col gap-2 !py-3">
      {invitesReceived.length > 0 && (
        <div className="flex flex-col gap-1">
          {invitesReceived.map((item) => (
            <Link
              key={`${item.kind}-${item.id}`}
              href={item.link}
              className="flex items-center gap-2 text-sm font-semibold text-brand-700 dark:text-brand-300 hover:underline"
            >
              <span>{KIND_ICON[item.kind]}</span>
              <span>
                {item.opponentName} nodigt je uit — {item.label}
              </span>
            </Link>
          ))}
        </div>
      )}

      {activeGames.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeGames.map((item) => (
            <Link
              key={`${item.kind}-${item.id}`}
              href={item.link}
              className={`text-xs font-bold rounded-full px-3 py-1 flex items-center gap-1 ${
                item.myTurn
                  ? "bg-brand-500 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              <span>{KIND_ICON[item.kind]}</span>
              <span>
                {item.opponentName ? `${item.opponentName} — ` : ""}
                {item.label}
                {item.myTurn ? " · jouw beurt!" : ""}
              </span>
            </Link>
          ))}
        </div>
      )}

      {invitesSent.length > 0 && (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Wachten op reactie: {invitesSent.map((i) => i.opponentName).join(", ")}
        </p>
      )}
    </div>
  );
}
