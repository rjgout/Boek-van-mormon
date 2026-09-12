"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function ForgotPasswordClient() {
  const [identifier, setIdentifier] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Er ging iets mis.");
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="max-w-md mx-auto card text-center flex flex-col gap-4">
        <div className="text-5xl">📬</div>
        <h1 className="text-xl font-extrabold text-brand-800 dark:text-brand-300">Check je inbox</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Als er een account bestaat met deze gegevens, ontvang je een e-mail met een link om een nieuw wachtwoord in te
          stellen.
        </p>
        <Link href="/login" className="btn-secondary self-center">
          Terug naar inloggen
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-extrabold mb-2 text-brand-800 dark:text-brand-300">Wachtwoord vergeten</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Vul je e-mailadres of gebruikersnaam (Naam#00) in — we sturen je een link om een nieuw wachtwoord in te
        stellen.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          className="input"
          placeholder="E-mailadres of gebruikersnaam#00"
          required
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        {error && <p className="text-red-600 dark:text-red-400 text-sm font-semibold">{error}</p>}
        <button type="submit" disabled={status === "sending"} className="btn-primary mt-2">
          {status === "sending" ? "Bezig..." : "Resetlink versturen"}
        </button>
      </form>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
        <Link href="/login" className="text-brand-600 font-bold">
          Terug naar inloggen
        </Link>
      </p>
    </div>
  );
}
