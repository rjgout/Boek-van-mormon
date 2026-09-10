"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
      <h1 className="text-2xl font-extrabold mb-6 text-brand-800">Inloggen</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          className="input"
          placeholder="E-mailadres of gebruikersnaam"
          required
          value={form.identifier}
          onChange={(e) => setForm({ ...form, identifier: e.target.value })}
        />
        <input
          className="input"
          placeholder="Wachtwoord"
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? "Bezig..." : "Inloggen"}
        </button>
      </form>
      <p className="text-sm text-slate-500 mt-4">
        Nog geen account?{" "}
        <Link href="/register" className="text-brand-600 font-bold">
          Maak er een aan
        </Link>
      </p>
      <p className="text-xs text-slate-400 mt-2">Demo-account: gebruikersnaam "anna", wachtwoord "demo1234".</p>
    </div>
  );
}
