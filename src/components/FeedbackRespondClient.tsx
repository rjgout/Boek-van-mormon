"use client";

import { useState } from "react";

const STATUS_LABELS: Record<string, string> = {
  NEW: "Nieuw",
  IN_PROGRESS: "Bezig",
  DONE: "Klaar",
  WONT_DO: "Wordt niet uitgevoerd",
};

interface Props {
  token: string;
  submitterName: string;
  submitterEmail: string;
  message: string;
  screenshot: string | null;
  initialStatus: string;
  createdAt: string;
}

export default function FeedbackRespondClient({
  token,
  submitterName,
  submitterEmail,
  message,
  screenshot,
  initialStatus,
  createdAt,
}: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function setNewStatus(next: "IN_PROGRESS" | "DONE" | "WONT_DO") {
    setBusy(next);
    setError(null);
    const res = await fetch(`/api/feedback/respond/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      setError(body.error ?? "Kon de status niet bijwerken.");
      return;
    }
    setStatus(next);
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">Feedbackmelding</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Van {submitterName} ({submitterEmail}) —{" "}
          {new Date(createdAt).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      <div className="card flex flex-col gap-3">
        <p className="text-sm whitespace-pre-wrap dark:text-slate-200">{message}</p>
        {screenshot && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={screenshot} alt="Screenshot" className="rounded-lg border border-slate-200 dark:border-slate-700 self-start max-w-full" />
        )}
      </div>

      <div className="card flex flex-col gap-3">
        <p className="text-sm dark:text-slate-200">
          Huidige status: <strong>{STATUS_LABELS[status] ?? status}</strong>
        </p>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary !px-3 !py-1.5" disabled={busy !== null} onClick={() => setNewStatus("IN_PROGRESS")}>
            {busy === "IN_PROGRESS" ? "Bezig..." : "🔧 Ik ga ermee bezig"}
          </button>
          <button className="btn-primary !px-3 !py-1.5" disabled={busy !== null} onClick={() => setNewStatus("DONE")}>
            {busy === "DONE" ? "Bezig..." : "✅ Klaar"}
          </button>
          <button
            className="btn-secondary !px-3 !py-1.5 !text-red-500 !border-red-200"
            disabled={busy !== null}
            onClick={() => setNewStatus("WONT_DO")}
          >
            {busy === "WONT_DO" ? "Bezig..." : "🚫 Wordt niet uitgevoerd"}
          </button>
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    </div>
  );
}
