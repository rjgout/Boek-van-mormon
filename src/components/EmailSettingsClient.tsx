"use client";

import { useState, FormEvent } from "react";

interface EmailSettingsView {
  enabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUsername: string;
  fromEmail: string;
  fromName: string;
  hasPassword: boolean;
}

export default function EmailSettingsClient({ initial }: { initial: EmailSettingsView }) {
  const [form, setForm] = useState({ ...initial, smtpPassword: "" });
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/email-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enabled: form.enabled,
        smtpHost: form.smtpHost,
        smtpPort: form.smtpPort,
        smtpSecure: form.smtpSecure,
        smtpUsername: form.smtpUsername,
        smtpPassword: form.smtpPassword,
        fromEmail: form.fromEmail,
        fromName: form.fromName,
      }),
    });
    setSaving(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage({ type: "error", text: data.error ?? "Er ging iets mis." });
      return;
    }
    setForm((f) => ({ ...f, smtpPassword: "", hasPassword: form.smtpPassword ? true : f.hasPassword }));
    setMessage({ type: "ok", text: "Opgeslagen." });
  }

  async function sendTest() {
    setTesting(true);
    setMessage(null);
    const res = await fetch("/api/admin/email-settings/test", { method: "POST" });
    setTesting(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage({ type: "error", text: data.error ?? "Versturen mislukt." });
      return;
    }
    setMessage({ type: "ok", text: "Testmail verstuurd — check je inbox." });
  }

  return (
    <div className="card flex flex-col gap-4">
      <div>
        <h2 className="font-extrabold">E-mailinstellingen</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Voor accountbevestiging en "wachtwoord vergeten"-links. Elke SMTP-dienst werkt — bv. een Microsoft 365-mailbox
          (smtp.office365.com, poort 587), Gmail met een app-wachtwoord, of je eigen mailserver.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm font-bold dark:text-slate-200">
          <input
            type="checkbox"
            className="h-4 w-4 accent-brand-500"
            checked={form.enabled}
            onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
          />
          E-mail versturen inschakelen
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            className="input"
            placeholder="SMTP-host (bv. smtp.office365.com)"
            value={form.smtpHost}
            onChange={(e) => setForm({ ...form, smtpHost: e.target.value })}
          />
          <input
            className="input"
            type="number"
            placeholder="Poort (587 = STARTTLS, 465 = TLS)"
            value={form.smtpPort}
            onChange={(e) => setForm({ ...form, smtpPort: Number(e.target.value) })}
          />
          <input
            className="input"
            placeholder="Gebruikersnaam / mailbox-adres"
            value={form.smtpUsername}
            onChange={(e) => setForm({ ...form, smtpUsername: e.target.value })}
          />
          <input
            className="input"
            type="password"
            placeholder={form.hasPassword ? "Wachtwoord (laat leeg om te behouden)" : "Wachtwoord"}
            value={form.smtpPassword}
            onChange={(e) => setForm({ ...form, smtpPassword: e.target.value })}
          />
          <input
            className="input"
            placeholder="Afzender-e-mailadres"
            value={form.fromEmail}
            onChange={(e) => setForm({ ...form, fromEmail: e.target.value })}
          />
          <input
            className="input"
            placeholder="Afzendernaam"
            value={form.fromName}
            onChange={(e) => setForm({ ...form, fromName: e.target.value })}
          />
        </div>

        <label className="flex items-center gap-2 text-sm dark:text-slate-200">
          <input
            type="checkbox"
            className="h-4 w-4 accent-brand-500"
            checked={form.smtpSecure}
            onChange={(e) => setForm({ ...form, smtpSecure: e.target.checked })}
          />
          Impliciete TLS (aanzetten bij poort 465, uit laten bij 587/STARTTLS)
        </label>

        {message && (
          <p className={`text-sm font-semibold ${message.type === "ok" ? "text-brand-600 dark:text-brand-300" : "text-red-600 dark:text-red-400"}`}>
            {message.text}
          </p>
        )}

        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Bezig..." : "Opslaan"}
          </button>
          <button type="button" className="btn-secondary" onClick={sendTest} disabled={testing || !form.enabled}>
            {testing ? "Bezig..." : "Testmail versturen"}
          </button>
        </div>
      </form>
    </div>
  );
}
