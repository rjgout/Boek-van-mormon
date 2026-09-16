"use client";

// De XP/streak-badge in de header (zie NavUserBadges.tsx) is een client
// component die zijn beginwaarde server-gerenderd meekrijgt, maar daarna
// niet vanzelf meekrijgt dat een andere actie op dezelfde pagina (of een
// child-component) XP heeft toegekend of afgeschreven — Next ververst een
// layout niet vanzelf bij client-side navigatie. Elke plek die XP toekent
// of afschrijft (les/oefening/hoofdstukraadspel/woordspel/podcast/
// kinderverhaal afgerond, hints/freezes gekocht) roept na een geslaagde
// aanroep announceXpChanged() aan; de badge luistert daarop en haalt de
// verse waarde zelf op (zie /api/user-badges).
const EVENT_NAME = "xp-changed";

export function announceXpChanged(): void {
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function onXpChanged(callback: () => void): () => void {
  window.addEventListener(EVENT_NAME, callback);
  return () => window.removeEventListener(EVENT_NAME, callback);
}
