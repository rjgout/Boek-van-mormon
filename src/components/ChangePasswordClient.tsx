"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordClient({ forced }: { forced: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.newPassword !== form.confirmPassword) {
      setError("De twee nieuwe wachtwoorden komen niet overeen.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Er ging iets mis.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-extrabold mb-2 text-brand-800 dark:text-brand-300">Wachtwoord wijzigen</h1>
      {forced && (
        <p className="text-sm bg-gold-50 dark:bg-slate-700 text-gold-700 dark:text-gold-400 rounded-xl px-3 py-2 mb-4">
          Een admin heeft je wachtwoord gereset. Kies hieronder eerst een eigen, nieuw wachtwoord voordat je verder kan.
        </p>
      )}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          className="input"
          placeholder={forced ? "Tijdelijk wachtwoord" : "Huidig wachtwoord"}
          type="password"
          required
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
        />
        <input
          className="input"
          placeholder="Nieuw wachtwoord"
          type="password"
          required
          minLength={8}
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        />
        <input
          className="input"
          placeholder="Bevestig nieuw wachtwoord"
          type="password"
          required
          minLength={8}
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />
        {error && <p className="text-red-600 dark:text-red-400 text-sm font-semibold">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? "Bezig..." : "Wachtwoord opslaan"}
        </button>
      </form>
    </div>
  );
}
