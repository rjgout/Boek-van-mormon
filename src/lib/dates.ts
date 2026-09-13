export function dayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10); // yyyy-mm-dd (UTC dagbucket)
}

export function daysBetween(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const da = new Date(`${a}T00:00:00Z`).getTime();
  const db = new Date(`${b}T00:00:00Z`).getTime();
  return Math.round((db - da) / msPerDay);
}

/** Maandag van de week waarin `d` valt, als yyyy-mm-dd. */
export function weekStartKey(d: Date = new Date()): string {
  const utc = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dow = utc.getUTCDay(); // 0 = zondag
  const diffToMonday = dow === 0 ? 6 : dow - 1;
  utc.setUTCDate(utc.getUTCDate() - diffToMonday);
  return dayKey(utc);
}

// --- Europe/Amsterdam-tijd -------------------------------------------------
//
// De rest van de app werkt bewust op UTC-dagbuckets (zie dayKey hierboven) —
// eenvoudig, maar niet wat je wil voor iets dat "elke dag om 18:00 uur
// Nederlandse tijd" moet wisselen (zie het dagelijkse woordspel,
// src/lib/wordGame.ts). Intl.DateTimeFormat rekent zomer-/wintertijd
// automatisch mee, dus dit blijft kloppen ongeacht de tijdzone waarin de
// server zelf draait.
export interface AmsterdamTime {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number; // 0-23
  minute: number;
}

const amsterdamFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Amsterdam",
  hour12: false,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function amsterdamNow(d: Date = new Date()): AmsterdamTime {
  const parts = Object.fromEntries(amsterdamFormatter.formatToParts(d).map((p) => [p.type, p.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    // Sommige Node/ICU-versies geven middernacht als "24" i.p.v. "00" terug.
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
  };
}
