"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ActiveGamesBanner from "@/components/ActiveGamesBanner";

interface ChapterOption {
  id: string;
  label: string;
  exerciseCount: number;
}

interface GameSettings {
  wordGameEnabled: boolean;
  scrabbleEnabled: boolean;
  gezinsavondEnabled: boolean;
  chapterGuessEnabled: boolean;
  challengesEnabled: boolean;
  liveExercisesEnabled: boolean;
}

interface Props {
  settings: GameSettings;
  isAdmin: boolean;
}

// Uitgezet (zie /adminbackend) betekent: verborgen voor gewone gebruikers,
// maar een admin blijft alles zien — dan met deze roodgerande "uitgeschakeld
// voor gebruikers"-badge in plaats van dat de kaart gewoon verdwijnt.
function GameCard({ enabled, isAdmin, children }: { enabled: boolean; isAdmin: boolean; children: ReactNode }) {
  if (!enabled && !isAdmin) return null;
  return (
    <div className={`card flex flex-col gap-3 ${!enabled ? "border-2 border-red-300 dark:border-red-800" : ""}`}>
      {!enabled && (
        <span className="text-xs font-bold uppercase text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-full px-2 py-0.5 self-start">
          Uitgeschakeld voor gebruikers
        </span>
      )}
      {children}
    </div>
  );
}

export default function LiveLobbyForm({ settings, isAdmin }: Props) {
  const router = useRouter();
  const [chapters, setChapters] = useState<ChapterOption[]>([]);
  const [chapterId, setChapterId] = useState("");
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

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-8">
      <ActiveGamesBanner />

      <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">Spelletjes en uitdagingen</h1>

      <GameCard enabled={settings.wordGameEnabled} isAdmin={isAdmin}>
        <h2 className="font-extrabold dark:text-slate-100">🟩 Woord van de dag</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Raad het 5-letterwoord uit het Boek van Mormon — elke dag om 18:00 uur een nieuw woord, één
          poging per dag, en het telt mee voor je streak.
        </p>
        <Link href="/word-game" className="btn-secondary self-start">
          Woord van de dag openen
        </Link>
      </GameCard>

      <GameCard enabled={settings.scrabbleEnabled} isAdmin={isAdmin}>
        <h2 className="font-extrabold dark:text-slate-100">🔤 Woordspel</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Een woordlegspel met alleen woorden uit het Boek van Mormon — daag een vriend uit en speel om de beurt,
          ieder op je eigen tempo.
        </p>
        <Link href="/scrabble" className="btn-secondary self-start">
          Woordspel openen
        </Link>
      </GameCard>

      <GameCard enabled={settings.gezinsavondEnabled} isAdmin={isAdmin}>
        <h2 className="font-extrabold dark:text-slate-100">🎉 Gezinsavond</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Een avontuurlijk bordspel over het Boek van Mormon voor het hele gezin — samen aan tafel op één apparaat, of
          ieder op je eigen telefoon. Ook leuk zonder veel voorkennis.
        </p>
        <Link href="/gezinsavond" className="btn-secondary self-start">
          Gezinsavond openen
        </Link>
      </GameCard>

      <GameCard enabled={settings.chapterGuessEnabled} isAdmin={isAdmin}>
        <h2 className="font-extrabold dark:text-slate-100">🔎 Raad het hoofdstuk</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Lees het eerste vers van een hoofdstuk en raad welk hoofdstuk het is — kies zelf je niveau, alleen of live
          met vrienden.
        </p>
        <Link href="/chapter-guess" className="btn-secondary self-start">
          Raad het hoofdstuk openen
        </Link>
      </GameCard>

      <GameCard enabled={settings.challengesEnabled} isAdmin={isAdmin}>
        <h2 className="font-extrabold dark:text-slate-100">⚔️ Uitdagingen</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Daag een vriend uit op een hoofdstuk: jullie spelen allebei wanneer het uitkomt, en zien daarna wie beter
          scoorde.
        </p>
        <Link href="/challenges" className="btn-secondary self-start">
          Uitdagingen openen
        </Link>
      </GameCard>

      <GameCard enabled={settings.liveExercisesEnabled} isAdmin={isAdmin}>
        <form onSubmit={createGame} className="flex flex-col gap-4">
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
      </GameCard>
    </div>
  );
}
