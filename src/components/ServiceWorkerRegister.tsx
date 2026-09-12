"use client";

import { useEffect } from "react";

/**
 * Registreert de service worker onvoorwaardelijk bij elk bezoek — niet pas
 * zodra iemand pushnotificaties aanzet (zie src/lib/pushClient.ts, die 'm
 * ook los registreert en dat blijft doen, register() is idempotent). Een
 * geregistreerde service worker is een van de installeerbaarheidscriteria
 * voor "toevoegen aan startscherm" (naast het manifest, zie layout.tsx).
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return null;
}
