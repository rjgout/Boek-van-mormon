"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ActiveGamesBanner from "@/components/ActiveGamesBanner";
import { SortableList, DragHandle, type DragHandleProps } from "@/components/SortableList";
import { applyPersonalOrder, fetchListOrder, saveListOrder } from "@/lib/listOrder";

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

interface GameEntry {
  id: string; // stabiele sleutel voor de sleepvolgorde (UserListOrder.itemKey)
  enabledKey: keyof GameSettings;
  icon: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}

// Vaste catalogus — nu data-driven (i.p.v. losse hardcoded kaarten) zodat
// hij herordend kan worden (zie SortableList/listOrder.ts, listKey="games").
const GAMES: GameEntry[] = [
  {
    id: "word-game",
    enabledKey: "wordGameEnabled",
    icon: "🟩",
    title: "Woord van de dag",
    description:
      "Raad het 5-letterwoord uit het Boek van Mormon — elke dag om 18:00 uur een nieuw woord, één poging per dag, en het telt mee voor je streak.",
    href: "/word-game",
    linkLabel: "Woord van de dag openen",
  },
  {
    id: "scrabble",
    enabledKey: "scrabbleEnabled",
    icon: "🔤",
    title: "Woordspel",
    description:
      "Een woordlegspel met alleen woorden uit het Boek van Mormon — daag een vriend uit en speel om de beurt, ieder op je eigen tempo.",
    href: "/scrabble",
    linkLabel: "Woordspel openen",
  },
  {
    id: "gezinsavond",
    enabledKey: "gezinsavondEnabled",
    icon: "🎉",
    title: "Gezinsavond",
    description:
      "Een avontuurlijk bordspel over het Boek van Mormon voor het hele gezin — samen aan tafel op één apparaat, of ieder op je eigen telefoon. Ook leuk zonder veel voorkennis.",
    href: "/gezinsavond",
    linkLabel: "Gezinsavond openen",
  },
  {
    id: "chapter-guess",
    enabledKey: "chapterGuessEnabled",
    icon: "🔎",
    title: "Raad het hoofdstuk",
    description:
      "Lees het eerste vers van een hoofdstuk en raad welk hoofdstuk het is — kies zelf je niveau, alleen of live met vrienden.",
    href: "/chapter-guess",
    linkLabel: "Raad het hoofdstuk openen",
  },
  {
    id: "challenges",
    enabledKey: "challengesEnabled",
    icon: "⚔️",
    title: "Uitdagingen",
    description: "Daag een vriend uit op een hoofdstuk: jullie spelen allebei wanneer het uitkomt, en zien daarna wie beter scoorde.",
    href: "/challenges",
    linkLabel: "Uitdagingen openen",
  },
];

export default function LiveLobbyForm({ settings, isAdmin }: Props) {
  const router = useRouter();
  const [chapters, setChapters] = useState<ChapterOption[]>([]);
  const [chapterId, setChapterId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [games, setGames] = useState<GameEntry[]>(() => GAMES.filter((g) => settings[g.enabledKey] || isAdmin));

  useEffect(() => {
    fetch("/api/chapters")
      .then((r) => r.json())
      .then((data: ChapterOption[]) => {
        setChapters(data);
        setChapterId(data[0]?.id ?? "");
      });
  }, []);

  useEffect(() => {
    const visible = GAMES.filter((g) => settings[g.enabledKey] || isAdmin);
    fetchListOrder("games").then((order) => setGames(applyPersonalOrder(visible, order)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function reorderGames(newGames: GameEntry[]) {
    setGames(newGames);
    saveListOrder(
      "games",
      newGames.map((g) => g.id)
    );
  }

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
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <ActiveGamesBanner />

      <div>
        <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">Spelletjes en uitdagingen</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Oefen op je eigen manier, of daag een vriend uit — sleep de kaarten in de volgorde die jou het beste uitkomt.
        </p>
      </div>

      {settings.liveExercisesEnabled && (
        <div className="card bg-gradient-to-br from-brand-500 to-brand-700 dark:from-brand-600 dark:to-brand-900 text-white flex flex-col gap-4">
          <div>
            <h2 className="font-extrabold text-lg">⚡ Live quiz starten</h2>
            <p className="text-brand-100 text-sm">Kies een hoofdstuk en nodig vrienden uit voor een live duel.</p>
          </div>
          <form onSubmit={createGame} className="flex flex-col gap-3">
            <select
              className="input !bg-white/90 dark:!bg-slate-900/60 !text-slate-800 dark:!text-slate-100 !border-0"
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
            >
              {chapters.map((c) => (
                <option key={c.id} value={c.id} disabled={c.exerciseCount === 0}>
                  {c.label} ({c.exerciseCount} oefeningen)
                </option>
              ))}
            </select>
            <button
              className="rounded-2xl bg-gold-400 text-brand-900 font-extrabold uppercase tracking-wide text-sm py-3 shadow-[0_4px_0_0_theme(colors.gold.600)] active:shadow-none active:translate-y-1 transition disabled:opacity-50"
              disabled={creating || !chapterId}
              type="submit"
            >
              {creating ? "Bezig..." : "Maak spel & nodig vrienden uit"}
            </button>
            {error && <p className="text-red-100 text-sm font-semibold">{error}</p>}
          </form>
        </div>
      )}

      <SortableList
        dndId="games-list"
        items={games}
        onReorder={reorderGames}
        className="grid sm:grid-cols-2 gap-4"
        renderItem={(game, handle) => {
          const enabled = settings[game.enabledKey];
          if (!enabled && !isAdmin) return null;
          return <GameCardBody game={game} enabled={enabled} handle={handle} />;
        }}
      />
    </div>
  );
}

// Uitgezet (zie /adminbackend) betekent: verborgen voor gewone gebruikers,
// maar een admin blijft alles zien — dan met deze roodgerande "uitgeschakeld
// voor gebruikers"-badge in plaats van dat de kaart gewoon verdwijnt. Deze
// render-functie krijgt de sleepgreep via het "handle"-argument van
// SortableList (zie renderItem hierboven) doorgegeven.
function GameCardBody({ game, enabled, handle }: { game: GameEntry; enabled: boolean; handle: DragHandleProps }) {
  return (
    <div
      className={`card flex flex-col gap-3 h-full ${!enabled ? "!border-2 !border-red-300 dark:!border-red-800" : ""}`}
    >
      {!enabled && (
        <span className="text-xs font-bold uppercase text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-full px-2 py-0.5 self-start">
          Uitgeschakeld voor gebruikers
        </span>
      )}
      <div className="flex items-center gap-2">
        <DragHandle {...handle} />
        <div className="text-2xl" aria-hidden>
          {game.icon}
        </div>
      </div>
      <h2 className="font-extrabold dark:text-slate-100">{game.title}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 flex-1">{game.description}</p>
      <Link href={game.href} className="btn-secondary self-start">
        {game.linkLabel}
      </Link>
    </div>
  );
}
