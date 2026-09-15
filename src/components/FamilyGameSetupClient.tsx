"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DURATIONS: { minutes: 15 | 30 | 60; label: string; icon: string }[] = [
  { minutes: 15, label: "15 minuten", icon: "⚡" },
  { minutes: 30, label: "30 minuten", icon: "🎲" },
  { minutes: 60, label: "60 minuten", icon: "🏠" },
];

const DICE_MODES: { value: "DIGITAL" | "PHYSICAL"; label: string; description: string; icon: string }[] = [
  { value: "DIGITAL", label: "Digitale dobbelsteen", description: "De app gooit voor je.", icon: "📱" },
  { value: "PHYSICAL", label: "Echte dobbelsteen", description: "Jullie gooien zelf, en voeren het aantal ogen in.", icon: "🎲" },
];

// Bewust maar twee keuzes vooraf (speelduur + dobbelsteen) — spelers/gasten
// voeg je toe in de lobby hierna, net als bij elk ander live spel (zie
// "Nodig uit" in GameRoom.tsx). Geen verdere instellingen: "simpel starten,
// later verdiepen" (zie het besproken ontwerp).
export default function FamilyGameSetupClient() {
  const router = useRouter();
  const [minutes, setMinutes] = useState<15 | 30 | 60>(30);
  const [diceMode, setDiceMode] = useState<"DIGITAL" | "PHYSICAL">("DIGITAL");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createGame() {
    setError(null);
    setStarting(true);
    const res = await fetch("/api/live/create-family-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ minutes, diceMode }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Kon geen spel starten.");
      setStarting(false);
      return;
    }
    router.push(`/live/${data.code}`);
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">🎉 Gezinsavond</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Een avontuurlijk bordspel over het Boek van Mormon — samen aan tafel, op één apparaat, of ieder op je eigen
          telefoon. Vrienden en gasten voeg je zo toe.
        </p>
      </div>

      <div className="card flex flex-col gap-3">
        <h2 className="font-extrabold dark:text-slate-100">Speelduur</h2>
        <div className="flex gap-3">
          {DURATIONS.map((d) => (
            <button
              key={d.minutes}
              onClick={() => setMinutes(d.minutes)}
              className={`flex-1 rounded-xl border-2 py-3 font-extrabold transition-colors ${
                minutes === d.minutes
                  ? "border-brand-500 bg-brand-50 dark:bg-slate-700 text-brand-700 dark:text-brand-300"
                  : "border-slate-200 dark:border-slate-600 hover:border-brand-300 dark:text-slate-100"
              }`}
            >
              <div className="text-xl mb-1">{d.icon}</div>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card flex flex-col gap-3">
        <h2 className="font-extrabold dark:text-slate-100">Dobbelsteen</h2>
        <div className="flex flex-col gap-2">
          {DICE_MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setDiceMode(m.value)}
              className={`text-left rounded-xl border-2 px-4 py-3 transition-colors ${
                diceMode === m.value
                  ? "border-brand-500 bg-brand-50 dark:bg-slate-700"
                  : "border-slate-200 dark:border-slate-600 hover:border-brand-300"
              }`}
            >
              <p className="font-extrabold dark:text-slate-100">
                {m.icon} {m.label}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{m.description}</p>
            </button>
          ))}
        </div>
      </div>

      <button className="btn-primary self-start" disabled={starting} onClick={createGame}>
        {starting ? "Bezig..." : "Maak spel"}
      </button>
      {error && <p className="text-red-600 dark:text-red-400 text-sm font-semibold">{error}</p>}
    </div>
  );
}
