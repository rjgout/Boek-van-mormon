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
