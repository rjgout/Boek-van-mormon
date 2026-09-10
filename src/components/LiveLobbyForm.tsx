"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface ChapterOption {
  id: string;
  label: string;
  exerciseCount: number;
}

export default function LiveLobbyForm() {
  const router = useRouter();
  const [chapters, setChapters] = useState<ChapterOption[]>([]);
  const [chapterId, setChapterId] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/chapters")
      .then((r) => r.json())
      .then((data: ChapterOption[]) => {
        setChapters(data);
        setChapterId(data[0]?.id ?? "");
      });
  }, []);

  async function createGame(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCreating(true);
    const res = await fetch("/api/live/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId }),
    });
    setCreating(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Kon geen spel starten.");
      return;
    }
    router.push(`/live/${data.code}`);
  }

  function joinGame(e: FormEvent) {
    e.preventDefault();
    if (joinCode.trim().length === 0) return;
    router.push(`/live/${joinCode.trim().toUpperCase()}`);
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-8">
      <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">Live spel</h1>

      <form onSubmit={createGame} className="card flex flex-col gap-4">
        <h2 className="font-extrabold">Nieuw spel starten</h2>
        <select className="input" value={chapterId} onChange={(e) => setChapterId(e.target.value)}>
          {chapters.map((c) => (
            <option key={c.id} value={c.id} disabled={c.exerciseCount === 0}>
              {c.label} ({c.exerciseCount} oefeningen)
            </option>
          ))}
        </select>
        <button className="btn-primary self-start" disabled={creating || !chapterId} type="submit">
          {creating ? "Bezig..." : "Maak spel & nodig vrienden uit"}
        </button>
        {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
      </form>

      <form onSubmit={joinGame} className="card flex flex-col gap-4">
        <h2 className="font-extrabold">Meedoen met een code</h2>
        <input
          className="input uppercase tracking-widest text-center font-extrabold"
          placeholder="BIJV. AB12C"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          maxLength={6}
        />
        <button className="btn-ice self-start" type="submit">
          Meedoen
        </button>
      </form>
    </div>
  );
}
