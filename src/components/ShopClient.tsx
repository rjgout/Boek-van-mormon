"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ShopData {
  xpTotal: number;
  hintBalance: number;
  hintPriceXp: number;
  freezeCount: number;
  freezePriceXp: number;
}

export default function ShopClient() {
  const router = useRouter();
  const [data, setData] = useState<ShopData | null>(null);
  const [hintQuantity, setHintQuantity] = useState(1);
  const [buyingHints, setBuyingHints] = useState(false);
  const [hintMessage, setHintMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [freezeQuantity, setFreezeQuantity] = useState(1);
  const [buyingFreezes, setBuyingFreezes] = useState(false);
  const [freezeMessage, setFreezeMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  function load() {
    fetch("/api/shop")
      .then((r) => r.json())
      .then(setData);
  }

  useEffect(load, []);

  async function buyHints() {
    if (!data) return;
    setBuyingHints(true);
    setHintMessage(null);
    const res = await fetch("/api/shop/hints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: hintQuantity }),
    });
    const body = await res.json().catch(() => ({}));
    setBuyingHints(false);
    if (!res.ok) {
      setHintMessage({ type: "error", text: body.error ?? "Kon de aankoop niet voltooien." });
      return;
    }
    setData({ ...data, xpTotal: body.xpTotal, hintBalance: body.hintBalance });
    setHintMessage({ type: "ok", text: `${hintQuantity} hint${hintQuantity > 1 ? "s" : ""} gekocht! 💡` });
    // De XP-badge in de header is server-gerenderd (layout.tsx) en anders
    // pas bij de volgende paginanavigatie ververst.
    router.refresh();
  }

  async function buyFreezes() {
    if (!data) return;
    setBuyingFreezes(true);
    setFreezeMessage(null);
    const res = await fetch("/api/shop/freezes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: freezeQuantity }),
    });
    const body = await res.json().catch(() => ({}));
    setBuyingFreezes(false);
    if (!res.ok) {
      setFreezeMessage({ type: "error", text: body.error ?? "Kon de aankoop niet voltooien." });
      return;
    }
    setData({ ...data, xpTotal: body.xpTotal, freezeCount: body.freezeCount });
    setFreezeMessage({ type: "ok", text: `${freezeQuantity} freeze${freezeQuantity > 1 ? "s" : ""} gekocht! 🧊` });
    router.refresh();
  }

  if (!data) return <p className="text-slate-400 dark:text-slate-500 text-center">Laden...</p>;

  const hintCost = hintQuantity * data.hintPriceXp;
  const canAffordHints = data.xpTotal >= hintCost;
  const freezeCost = freezeQuantity * data.freezePriceXp;
  const canAffordFreezes = data.xpTotal >= freezeCost;

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
        <div className="card !py-3 !px-5">
          <div className="text-xl font-extrabold text-ice-600 dark:text-ice-400">🧊 {data.freezeCount}</div>
          <div className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Freezes</div>
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
            <select
              className="input !w-20 text-center"
              value={hintQuantity}
              onChange={(e) => setHintQuantity(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button className="btn-primary !px-4 !py-2" disabled={buyingHints || !canAffordHints} onClick={buyHints}>
            {buyingHints ? "Bezig..." : `Koop voor ${hintCost} XP`}
          </button>
        </div>
        {!canAffordHints && <p className="text-xs text-red-500 dark:text-red-400">Je hebt niet genoeg XP.</p>}
        {hintMessage && (
          <p
            className={`text-sm font-semibold ${
              hintMessage.type === "ok" ? "text-brand-600 dark:text-brand-300" : "text-red-600 dark:text-red-400"
            }`}
          >
            {hintMessage.text}
          </p>
        )}
      </div>

      <div className="card flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-extrabold text-lg dark:text-slate-100">🧊 Streak freeze</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Redt je dagstreak automatisch als je een keer geen tijd hebt om te oefenen — net als een freeze die je
              verdient op een mijlpaal of van een vriend krijgt.
            </p>
          </div>
          <span className="text-sm font-bold text-gold-600 dark:text-gold-400 whitespace-nowrap">
            {data.freezePriceXp} XP / stuk
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-2 text-sm dark:text-slate-200">
            Aantal
            <select
              className="input !w-20 text-center"
              value={freezeQuantity}
              onChange={(e) => setFreezeQuantity(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button
            className="btn-primary !px-4 !py-2"
            disabled={buyingFreezes || !canAffordFreezes}
            onClick={buyFreezes}
          >
            {buyingFreezes ? "Bezig..." : `Koop voor ${freezeCost} XP`}
          </button>
        </div>
        {!canAffordFreezes && <p className="text-xs text-red-500 dark:text-red-400">Je hebt niet genoeg XP.</p>}
        {freezeMessage && (
          <p
            className={`text-sm font-semibold ${
              freezeMessage.type === "ok" ? "text-brand-600 dark:text-brand-300" : "text-red-600 dark:text-red-400"
            }`}
          >
            {freezeMessage.text}
          </p>
        )}
      </div>
    </div>
  );
}
