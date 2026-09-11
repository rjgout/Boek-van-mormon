"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordClient({ token }: { token: string | null }) {
  const router = useRouter();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="max-w-md mx-auto card text-center flex flex-col gap-4">
        <h1 className="text-xl font-extrabold text-red-600 dark:text-red-400">Geen resetlink gevonden</h1>
        <Link href="/forgot-password" className="btn-secondary self-center">
          Nieuwe resetlink aanvragen
        </Link>
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.newPassword !== form.confirmPassword) {
      setError("De twee wachtwoorden komen niet overeen.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: form.newPassword }),
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
      <h1 className="text-2xl font-extrabold mb-4 text-brand-800 dark:text-brand-300">Nieuw wachtwoord instellen</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
          {loading ? "Bezig..." : "Wachtwoord instellen"}
        </button>
      </form>
    </div>
  );
}
