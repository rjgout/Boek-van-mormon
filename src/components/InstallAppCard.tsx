"use client";

import { useEffect, useState } from "react";
import { hasInstallPrompt, onInstallPromptChange, promptInstall, isStandalone, isIOS } from "@/lib/pwaInstall";

/**
 * Stap 0 van de onboarding (ná registratie) — de enige plek waar deze volle
 * kaart nog gebruikt wordt. Zie HeaderInstallHint.tsx voor de kleinere,
 * terugkerende herinnering die daarna in de header verschijnt zolang de app
 * nog niet geïnstalleerd is.
 */
export default function InstallAppCard() {
  const [standalone, setStandalone] = useState(false);
  const [promptAvailable, setPromptAvailable] = useState(false);
  const [ios, setIos] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dismissedResult, setDismissedResult] = useState(false);

  useEffect(() => {
    setStandalone(isStandalone());
    setPromptAvailable(hasInstallPrompt());
    setIos(isIOS());
    return onInstallPromptChange(setPromptAvailable);
  }, []);

  if (standalone) {
    return (
      <div className="card text-left">
        <div className="text-3xl mb-2">✅</div>
        <h3 className="font-extrabold mb-1 dark:text-slate-100">App staat al op je scherm</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Je gebruikt de app al — top, dan kan je ook pushmeldingen ontvangen.</p>
      </div>
    );
  }

  async function onInstallClick() {
    setBusy(true);
    const outcome = await promptInstall();
    setBusy(false);
    if (outcome !== "unavailable") setDismissedResult(true);
  }

  return (
    <div className="card text-left">
      <div className="text-3xl mb-2">📲</div>
      <h3 className="font-extrabold mb-1 dark:text-slate-100">
        Zet de app op je {ios ? "beginscherm" : "startscherm"}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        Nodig, want pushmeldingen (zie de laatste stap) werken alleen als de app op je scherm staat.
      </p>

      {promptAvailable && (
        <button className="btn-primary" onClick={onInstallClick} disabled={busy}>
          {busy ? "Bezig..." : "App installeren"}
        </button>
      )}

      {!promptAvailable && dismissedResult && (
        <p className="text-sm text-slate-500 dark:text-slate-400">Oké, je kan dit later alsnog doen.</p>
      )}

      {!promptAvailable && !dismissedResult && ios && (
        <ol className="text-sm text-slate-500 dark:text-slate-400 list-decimal list-inside flex flex-col gap-1">
          <li>Tik onderin Safari op het deel-icoon</li>
          <li>Kies &ldquo;Zet op beginscherm&rdquo;</li>
          <li>Tik rechtsboven op &ldquo;Voeg toe&rdquo;</li>
        </ol>
      )}

      {!promptAvailable && !dismissedResult && !ios && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gebruik het menu van je browser en kies &ldquo;App installeren&rdquo; of &ldquo;Toevoegen aan startscherm&rdquo;.
        </p>
      )}
    </div>
  );
}
