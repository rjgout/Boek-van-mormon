"use client";

import { useEffect, useMemo, useState } from "react";

interface DictionaryEntry {
  word: string;
  count: number;
}

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

type FilterMode = "letter" | "length";

export default function DictionaryClient() {
  const [entries, setEntries] = useState<DictionaryEntry[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<FilterMode>("letter");
  const [letter, setLetter] = useState<string | null>("a");
  const [length, setLength] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/dictionary")
      .then(async (r) => {
        const data = await r.json().catch(() => null);
        if (!r.ok) throw new Error(data?.error ?? `Er ging iets mis (${r.status}).`);
        return data;
      })
      .then((d) => setEntries(d.entries ?? []))
      .catch((e) => setLoadError(e instanceof Error ? e.message : "Er ging iets mis."));
  }, []);

  // Alle beschikbare woordlengtes, aflopend uit de data i.p.v. een geraden
  // vaste reeks — zo klopt de chiprij vanzelf ongeacht welke woorden er in
  // het Boek van Mormon voorkomen.
  const lengths = useMemo(() => {
    if (!entries) return [];
    return Array.from(new Set(entries.map((e) => e.word.length))).sort((a, b) => a - b);
  }, [entries]);

  // Bij typen doorzoek je de hele lijst (het letter-/lengtefilter doet er dan
  // niet toe); zonder zoekterm filter je op beginletter of -lengte, zodat de
  // lijst (8500+ woorden) niet in één keer helemaal gerenderd hoeft te worden.
  const filtered = useMemo(() => {
    if (!entries) return [];
    const q = query.trim().toLowerCase();
    if (q) return entries.filter((e) => e.word.includes(q));
    if (mode === "letter" && letter) return entries.filter((e) => e.word.startsWith(letter));
    if (mode === "length" && length !== null) return entries.filter((e) => e.word.length === length);
    return entries;
  }, [entries, query, mode, letter, length]);

  function selectMode(next: FilterMode) {
    setMode(next);
    setQuery("");
  }

  if (loadError) {
    return (
      <div className="max-w-md mx-auto card text-center flex flex-col gap-3">
        <p className="text-red-600 dark:text-red-400 font-semibold">{loadError}</p>
        <button className="btn-secondary self-center" onClick={() => window.location.reload()}>
          Opnieuw proberen
        </button>
      </div>
    );
  }

  if (!entries) {
    return <p className="text-center text-slate-400 dark:text-slate-500">Laden...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">Woordenboek</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Alle {entries.length.toLocaleString("nl")} woorden uit het Boek van Mormon. Het getal tussen haakjes is hoe
          vaak het woord voorkomt — ook handig bij woordspelletjes.
        </p>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Zoek een woord..."
        className="input"
        aria-label="Zoek een woord"
      />

      <div className="flex gap-2 text-xs font-bold uppercase">
        <button
          className={`px-3 py-1.5 rounded-lg ${mode === "letter" ? "bg-brand-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}
          onClick={() => selectMode("letter")}
        >
          Op letter
        </button>
        <button
          className={`px-3 py-1.5 rounded-lg ${mode === "length" ? "bg-brand-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}
          onClick={() => selectMode("length")}
        >
          Op lengte
        </button>
      </div>

      {mode === "letter" ? (
        <div className="flex flex-wrap gap-1">
          <button
            className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
              !query && !letter
                ? "bg-brand-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
            }`}
            onClick={() => {
              setQuery("");
              setLetter(null);
            }}
          >
            Alle
          </button>
          {ALPHABET.map((l) => (
            <button
              key={l}
              className={`w-7 h-7 rounded-lg text-xs font-bold uppercase ${
                !query && letter === l
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
              onClick={() => {
                setQuery("");
                setLetter(l);
              }}
            >
              {l}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1">
          <button
            className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
              !query && length === null
                ? "bg-brand-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
            }`}
            onClick={() => {
              setQuery("");
              setLength(null);
            }}
          >
            Alle
          </button>
          {lengths.map((n) => (
            <button
              key={n}
              className={`w-8 h-7 rounded-lg text-xs font-bold ${
                !query && length === n
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
              onClick={() => {
                setQuery("");
                setLength(n);
              }}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500">
        {filtered.length.toLocaleString("nl")} {filtered.length === 1 ? "woord" : "woorden"}
      </p>

      <div className="card !p-0 overflow-hidden">
        <ul className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.map((e) => (
            <li key={e.word} className="px-4 py-2 flex items-baseline justify-between gap-3">
              <span className="dark:text-slate-100">{e.word}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">({e.count})</span>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-slate-400 dark:text-slate-500">Geen woorden gevonden.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
