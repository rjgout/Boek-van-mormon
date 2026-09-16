"use client";

import { useEffect, useRef, useState } from "react";

interface DeployStatus {
  phase: "idle" | "pulling" | "stopping" | "starting" | "healthchecking" | "success" | "failed_rolled_back" | "failed_critical";
  message: string;
  updatedAt: string;
  logs: { ts: string; message: string }[];
  maintenanceOn: boolean;
  busy: boolean;
  hasRollbackTarget: boolean;
}

const BUSY_PHASES = ["pulling", "stopping", "starting", "healthchecking"];

const PHASE_LABELS: Record<DeployStatus["phase"], string> = {
  idle: "Niets aan de hand",
  pulling: "Nieuwe versie ophalen...",
  stopping: "Bezig met wisselen...",
  starting: "Nieuwe versie starten...",
  healthchecking: "Wachten op gezondheidscontrole...",
  success: "Gelukt",
  failed_rolled_back: "Mislukt — teruggezet naar vorige versie",
  failed_critical: "Mislukt — ingrijpen nodig",
};

export default function AdminDeployClient({ configured }: { configured: boolean }) {
  const [status, setStatus] = useState<DeployStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function refresh() {
    try {
      const res = await fetch("/api/admin/deploy/status", { cache: "no-store" });
      if (!res.ok) {
        setError((await res.json().catch(() => null))?.error ?? "Kon status niet ophalen.");
        return;
      }
      setStatus(await res.json());
      setError(null);
    } catch {
      setError("Kon de deploy-agent niet bereiken.");
    }
  }

  useEffect(() => {
    if (!configured) return;
    refresh();
    pollRef.current = setInterval(refresh, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured]);

  async function callAction(path: string, body?: unknown) {
    setActionBusy(true);
    setError(null);
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        setError((await res.json().catch(() => null))?.error ?? "Actie mislukt.");
      }
      await refresh();
    } catch {
      setError("Kon de deploy-agent niet bereiken.");
    }
    setActionBusy(false);
  }

  if (!configured) {
    return (
      <details className="group card flex flex-col gap-3">
        <summary className="font-extrabold cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden flex items-center justify-between">
          Deployen &amp; onderhoudsmodus
          <span className="text-slate-400 transition-transform group-open:rotate-180" aria-hidden>
            ▾
          </span>
        </summary>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Niet geconfigureerd op deze installatie (geen <code>DEPLOY_AGENT_URL</code>/<code>DEPLOY_AGENT_TOKEN</code>)
          — dit paneel hoort bij de Synology/Portainer-deployopzet, zie{" "}
          <code>docs/DEPLOY-SYNOLOGY.md</code>.
        </p>
      </details>
    );
  }

  const isBusy = actionBusy || (status ? BUSY_PHASES.includes(status.phase) : false);

  return (
    <details className="group card flex flex-col gap-4" open>
      <summary className="font-extrabold cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden flex items-center justify-between">
        Deployen &amp; onderhoudsmodus
        <span className="text-slate-400 transition-transform group-open:rotate-180" aria-hidden>
          ▾
        </span>
      </summary>

      {status && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                status.maintenanceOn ? "bg-gold-500" : "bg-brand-500"
              }`}
              aria-hidden
            />
            <span className="font-bold text-sm dark:text-slate-100">{PHASE_LABELS[status.phase]}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {status.maintenanceOn ? "· onderhoudsmodus staat AAN" : "· site staat live"}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{status.message}</p>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <button className="btn-secondary !px-3 !py-1.5 !text-sm" disabled={isBusy} onClick={() => callAction("/api/admin/deploy/start")}>
          🚀 Nu deployen
        </button>
        <button
          className="btn-secondary !px-3 !py-1.5 !text-sm"
          disabled={isBusy}
          onClick={() => callAction("/api/admin/deploy/maintenance", { on: !status?.maintenanceOn })}
        >
          {status?.maintenanceOn ? "Onderhoudsmodus uit" : "Onderhoudsmodus aan"}
        </button>
        <button
          className="btn-secondary !px-3 !py-1.5 !text-sm"
          disabled={isBusy || !status?.hasRollbackTarget}
          onClick={() => callAction("/api/admin/deploy/rollback")}
        >
          ⏪ Rollback naar vorige versie
        </button>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {status && status.logs.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 max-h-48 overflow-y-auto text-xs font-mono text-slate-600 dark:text-slate-300 flex flex-col gap-1">
          {status.logs
            .slice()
            .reverse()
            .map((l, i) => (
              <div key={i}>
                <span className="text-slate-400 dark:text-slate-500">{new Date(l.ts).toLocaleTimeString("nl-NL")}</span> {l.message}
              </div>
            ))}
        </div>
      )}
    </details>
  );
}
