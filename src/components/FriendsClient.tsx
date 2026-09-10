"use client";

import { useEffect, useState, FormEvent } from "react";

interface FriendUser {
  id: string;
  username: string;
  displayName: string;
  xpTotal: number;
  currentStreak: number;
}

interface FriendsData {
  friends: FriendUser[];
  incoming: { friendshipId: string; from: FriendUser }[];
  outgoing: { friendshipId: string; to: FriendUser }[];
}

export default function FriendsClient() {
  const [data, setData] = useState<FriendsData | null>(null);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [giftedTo, setGiftedTo] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/friends");
    if (res.ok) setData(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function sendRequest(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/friends/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage(body.error ?? "Er ging iets mis.");
    } else {
      setMessage(`Vriendschapsverzoek naar ${username} verstuurd!`);
      setUsername("");
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

      <form onSubmit={sendRequest} className="card flex gap-3">
        <input
          className="input"
          placeholder="Gebruikersnaam van je vriend"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="btn-primary shrink-0" type="submit">
          Toevoegen
        </button>
      </form>
      {message && <p className="text-sm font-semibold text-brand-600">{message}</p>}

      {data.incoming.length > 0 && (
        <section>
          <h2 className="font-extrabold mb-2 text-slate-700 dark:text-slate-200">Verzoeken</h2>
          <div className="flex flex-col gap-2">
            {data.incoming.map(({ friendshipId, from }) => (
              <div key={friendshipId} className="card flex items-center justify-between !py-3">
                <span className="font-bold">{from.displayName} (@{from.username})</span>
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
                Wachten op {to.displayName} (@{to.username})
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-extrabold mb-2 text-slate-700 dark:text-slate-200">Jouw vrienden ({data.friends.length})</h2>
        {data.friends.length === 0 && <p className="text-slate-400 dark:text-slate-500">Nog geen vrienden — voeg iemand toe hierboven!</p>}
        <div className="flex flex-col gap-2">
          {data.friends.map((f) => (
            <div key={f.id} className="card flex items-center justify-between !py-3">
              <div>
                <div className="font-bold">
                  {f.displayName} <span className="text-slate-400 dark:text-slate-500 font-normal">@{f.username}</span>
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500">
                  🔥 {f.currentStreak} streak · ⭐ {f.xpTotal} XP
                </div>
              </div>
              <button
                className="btn-ice !px-3 !py-1.5"
                onClick={() => giftFreeze(f.id)}
                disabled={giftedTo === f.id}
              >
                {giftedTo === f.id ? "Verstuurd!" : "🧊 Geef freeze"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
