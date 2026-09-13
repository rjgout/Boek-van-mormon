"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatTag } from "@/lib/handle";

interface FriendUser {
  id: string;
  handle: string;
  discriminator: string;
  xpTotal: number;
  currentStreak: number;
}

interface FriendsData {
  friends: FriendUser[];
  incoming: { friendshipId: string; from: FriendUser }[];
  outgoing: { friendshipId: string; to: FriendUser }[];
}

interface SearchResult {
  id: string;
  handle: string;
  discriminator: string;
}

export default function FriendsClient() {
  const [data, setData] = useState<FriendsData | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<Set<string>>(new Set());
  const [giftedTo, setGiftedTo] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/friends");
    if (res.ok) setData(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      return;
    }
    const timeout = setTimeout(() => {
      fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((d) => setResults(d.results));
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  async function sendRequest(target: SearchResult) {
    setMessage(null);
    const res = await fetch("/api/friends/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId: target.id }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage(body.error ?? "Er ging iets mis.");
    } else {
      setMessage(`Vriendschapsverzoek naar ${formatTag(target.handle, target.discriminator)} verstuurd!`);
      setSentTo((prev) => new Set(prev).add(target.id));
      load();
    }
  }

  async function respond(friendshipId: string, action: "accept" | "decline") {
    await fetch(`/api/friends/${friendshipId}/${action}`, { method: "POST" });
    load();
  }

  async function giftFreeze(toUserId: string) {
    setMessage(null);
    const res = await fetch("/api/freezes/gift", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toUserId }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage(body.error ?? "Kon geen freeze geven.");
    } else {
      setGiftedTo(toUserId);
      setMessage("Streak freeze verstuurd! 🧊");
      setTimeout(() => setGiftedTo(null), 2000);
    }
  }

  if (!data) return <p className="text-slate-400 dark:text-slate-500">Laden...</p>;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">Vrienden</h1>

      <div className="card flex flex-col gap-3">
        <input
          className="input"
          placeholder="Zoek op gebruikersnaam (Naam#42) of, als iemand dat heeft aangezet, e-mailadres"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {results && results.length === 0 && query.trim().length >= 2 && (
          <p className="text-sm text-slate-400 dark:text-slate-500">Niemand gevonden.</p>
        )}
        {results && results.length > 0 && (
          <div className="flex flex-col gap-2">
            {results.map((r) => (
              <div key={r.id} className="flex items-center justify-between !py-2">
                <span className="dark:text-slate-100">{formatTag(r.handle, r.discriminator)}</span>
                <button
                  className="btn-secondary !px-3 !py-1.5"
                  disabled={sentTo.has(r.id)}
                  onClick={() => sendRequest(r)}
                >
                  {sentTo.has(r.id) ? "Verstuurd" : "Toevoegen"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {message && <p className="text-sm font-semibold text-brand-600">{message}</p>}

      {data.incoming.length > 0 && (
        <section>
          <h2 className="font-extrabold mb-2 text-slate-700 dark:text-slate-200">Verzoeken</h2>
          <div className="flex flex-col gap-2">
            {data.incoming.map(({ friendshipId, from }) => (
              <div key={friendshipId} className="card flex items-center justify-between !py-3">
                <span className="font-bold">{formatTag(from.handle, from.discriminator)}</span>
                <div className="flex gap-2">
                  <button className="btn-primary !px-3 !py-1.5" onClick={() => respond(friendshipId, "accept")}>
                    Accepteren
                  </button>
                  <button className="btn-secondary !px-3 !py-1.5" onClick={() => respond(friendshipId, "decline")}>
                    Weigeren
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.outgoing.length > 0 && (
        <section>
          <h2 className="font-extrabold mb-2 text-slate-700 dark:text-slate-200">Verstuurde verzoeken</h2>
          <div className="flex flex-col gap-2">
            {data.outgoing.map(({ friendshipId, to }) => (
              <div key={friendshipId} className="card !py-3 text-slate-500 dark:text-slate-400">
                Wachten op {formatTag(to.handle, to.discriminator)}
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-extrabold mb-2 text-slate-700 dark:text-slate-200">Jouw vrienden ({data.friends.length})</h2>
        {data.friends.length === 0 && <p className="text-slate-400 dark:text-slate-500">Nog geen vrienden — zoek iemand hierboven!</p>}
        <div className="flex flex-col gap-2">
          {data.friends.map((f) => (
            <div key={f.id} className="card flex items-center justify-between !py-3">
              <div>
                <div className="font-bold">{formatTag(f.handle, f.discriminator)}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500">
                  🔥 {f.currentStreak} streak · ⭐ {f.xpTotal} XP
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link href={`/challenges?friend=${f.id}`} className="btn-secondary !px-3 !py-1.5">
                  ⚔️ Daag uit
                </Link>
                <Link href={`/scrabble?friend=${f.id}`} className="btn-secondary !px-3 !py-1.5">
                  🔤 Woordspel
                </Link>
                <button
                  className="btn-ice !px-3 !py-1.5"
                  onClick={() => giftFreeze(f.id)}
                  disabled={giftedTo === f.id}
                >
                  {giftedTo === f.id ? "Verstuurd!" : "🧊 Geef freeze"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
