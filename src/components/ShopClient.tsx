"use client";

import { useEffect, useState } from "react";

interface ShopData {
  xpTotal: number;
  hintBalance: number;
  hintPriceXp: number;
}

export default function ShopClient() {
  const [data, setData] = useState<ShopData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  function load() {
    fetch("/api/shop")
      .then((r) => r.json())
      .then(setData);
  }

  useEffect(load, []);

  async function buy() {
    if (!data) return;
    setBuying(true);
    setMessage(null);
    const res = await fetch("/api/shop/hints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    const body = await res.json().catch(() => ({}));
    setBuying(false);
    if (!res.ok) {
      setMessage({ type: "error", text: body.error ?? "Kon de aankoop niet voltooien." });
      return;
    }
    setData({ xpTotal: body.xpTotal, hintBalance: body.hintBalance, hintPriceXp: data.hintPriceXp });
    setMessage({ type: "ok", text: `${quantity} hint${quantity > 1 ? "s" : ""} gekocht! 💡` });
  }

  if (!data) return <p className="text-slate-400 dark:text-slate-500 text-center">Laden...</p>;

  const cost = quantity * data.hintPriceXp;
  const canAfford = data.xpTotal >= cost;

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">Winkel</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Wissel je verdiende XP in voor handige extra's.</p>
      </div>

      <div className="flex gap-4 text-center justify-center">
        <div className="card !py-3 !px-5">
          <div className="text-xl font-extrabold text-gold-600 dark:text-gold-400">⭐ {data.xpTotal}</div>
          <div className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Jouw XP</div>
        </div>
        <div className="card !py-3 !px-5">
          <div className="text-xl font-extrabold text-brand-600 dark:text-brand-300">💡 {data.hintBalance}</div>
          <div className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Hints</div>
        </div>
      </div>

      <div className="card flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-extrabold text-lg dark:text-slate-100">💡 Hint</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Highlight bij het Woordspel welke letters op je rek samen een woord kunnen vormen — overal inzetbaar
              waar hints gebruikt kunnen worden, ongeacht hoeveel je er verzamelt.
            </p>
          </div>
          <span className="text-sm font-bold text-gold-600 dark:text-gold-400 whitespace-nowrap">
            {data.hintPriceXp} XP / stuk
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-2 text-sm dark:text-slate-200">
            Aantal
            <input
              type="number"
              min={1}
              max={1000}
              className="input !w-20 text-center"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(1000, Number(e.target.value) || 1)))}
            />
          </label>
          <button className="btn-primary !px-4 !py-2" disabled={buying || !canAfford} onClick={buy}>
            {buying ? "Bezig..." : `Koop voor ${cost} XP`}
          </button>
        </div>
        {!canAfford && <p className="text-xs text-red-500 dark:text-red-400">Je hebt niet genoeg XP.</p>}
        {message && (
          <p
            className={`text-sm font-semibold ${
              message.type === "ok" ? "text-brand-600 dark:text-brand-300" : "text-red-600 dark:text-red-400"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
