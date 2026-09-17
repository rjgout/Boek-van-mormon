// Gebaseerd op de officiële Nederlandse Scrabble-letterverdeling en -waarden
// (102 stenen) — met één bewuste aanpassing, zie de q hieronder.
export const BLANK = "?";

export const LETTER_DISTRIBUTION: Record<string, { count: number; value: number }> = {
  A: { count: 6, value: 1 },
  B: { count: 2, value: 3 },
  C: { count: 2, value: 5 },
  D: { count: 5, value: 2 },
  E: { count: 18, value: 1 },
  F: { count: 2, value: 4 },
  G: { count: 3, value: 3 },
  H: { count: 2, value: 4 },
  I: { count: 4, value: 1 },
  J: { count: 2, value: 4 },
  K: { count: 3, value: 3 },
  L: { count: 3, value: 3 },
  M: { count: 3, value: 3 },
  N: { count: 10, value: 1 },
  O: { count: 6, value: 1 },
  P: { count: 2, value: 3 },
  // Geen Q: de woordenlijst (prisma/bomWords.json, zie
  // src/lib/scrabble/dictionary.ts) bevat geen enkel woord met een q — die
  // steen zou dus nooit ergens neer te leggen zijn. De steen die de
  // officiële verdeling er hier normaal aan besteedt gaat naar de blanco
  // hieronder, zodat het totaal van 102 stenen gelijk blijft.
  R: { count: 5, value: 2 },
  S: { count: 5, value: 2 },
  T: { count: 5, value: 2 },
  U: { count: 3, value: 4 },
  V: { count: 2, value: 4 },
  W: { count: 2, value: 5 },
  X: { count: 1, value: 8 },
  Y: { count: 1, value: 8 },
  Z: { count: 2, value: 4 },
  [BLANK]: { count: 3, value: 0 },
};

// Dubbel zo groot als het officiële Scrabble-rek (7) — maakt het spel
// makkelijker: meer keuze uit letters om een woord mee te vinden.
export const RACK_SIZE = 14;

export function letterValue(letter: string): number {
  return LETTER_DISTRIBUTION[letter]?.value ?? 0;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Bouwt een nieuwe, geschudde zak van alle 102 stenen. */
export function createBag(): string[] {
  const bag: string[] = [];
  for (const [letter, { count }] of Object.entries(LETTER_DISTRIBUTION)) {
    for (let i = 0; i < count; i++) bag.push(letter);
  }
  return shuffle(bag);
}

/** Trekt tot `count` stenen van het einde van de zak (die als stapel dient). Muteert `bag` niet. */
export function drawTiles(bag: string[], count: number): { drawn: string[]; remaining: string[] } {
  const n = Math.min(count, bag.length);
  return { drawn: bag.slice(bag.length - n), remaining: bag.slice(0, bag.length - n) };
}

/**
 * Haalt de voor een zet benodigde stenen van het rek af (bij een blanco
 * wordt een "?" verbruikt, niet de gekozen letter). Geeft null als het rek
 * de benodigde stenen niet heeft (client loog, of dubbel verzonden verzoek).
 */
export function consumeFromRack(rack: string[], needed: { letter: string; isBlank: boolean }[]): string[] | null {
  const remaining = [...rack];
  for (const tile of needed) {
    const want = tile.isBlank ? BLANK : tile.letter;
    const idx = remaining.indexOf(want);
    if (idx === -1) return null;
    remaining.splice(idx, 1);
  }
  return remaining;
}
