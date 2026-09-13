"use client";

import { useState } from "react";

export default function ReseedClient() {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setRunning(true);
    setError(null);
    setLogs(null);
    const res = await fetch("/api/admin/reseed", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setRunning(false);
    setLogs(data.logs ?? null);
    if (!res.ok) {
      setError(data.error ?? "Er ging iets mis.");
    }
  }

  return (
    <details className="group card flex flex-col gap-4">
      <summary className="font-extrabold cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden flex items-center justify-between">
        Content opnieuw laden
        <span className="text-slate-400 transition-transform group-open:rotate-180" aria-hidden>
          ▾
        </span>
      </summary>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Zet de nieuwste content (boeken/hoofdstukken/oefeningen, podcastafleveringen, achievements) in de database —
        hetzelfde als <code>npm run db:seed</code>, maar dan zonder terminal. Bestaande gebruikers, voortgang,
        streaks en scores blijven ongemoeid; er wordt alleen content toegevoegd of bijgewerkt. Doe dit na elke
        update die nieuwe content toevoegt (bv. een nieuwe podcastaflevering).
      </p>

      <button className="btn-primary self-start" disabled={running} onClick={run}>
        {running ? "Bezig..." : "Content opnieuw laden"}
      </button>

      {error && <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>}

      {logs && logs.length > 0 && (
        <pre className="text-xs bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-xl p-3 overflow-x-auto whitespace-pre-wrap">
          {logs.join("\n")}
        </pre>
      )}
    </details>
  );
}
