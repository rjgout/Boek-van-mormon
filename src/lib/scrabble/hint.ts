import { ALL_WORDS } from "./dictionary";
import { BLANK } from "./tiles";

export interface HintResult {
  word: string;
  usedIndices: number[]; // indices in het rek-array die samen `word` spellen
}

// Probeert `word` (hoofdletters) volledig te spellen met de letters op
// `rack` (blanco's zijn joker). Geeft de gebruikte rek-indices terug, of
// null als het niet lukt.
function tryConsume(word: string, rack: string[]): number[] | null {
  const available = rack.map((letter, index) => ({ letter, index }));
  const used: number[] = [];
  for (const ch of word) {
    let pos = available.findIndex((r) => r.letter === ch);
    if (pos === -1) pos = available.findIndex((r) => r.letter === BLANK);
    if (pos === -1) return null;
    used.push(available[pos].index);
    available.splice(pos, 1);
  }
  return used;
}

/**
 * Zoekt het langste woord uit het Boek van Mormon-woordenboek dat volledig
 * met de letters op dit rek te spellen is — puur een rek-hint, los van het
 * bord (geen aansluiting op bestaande tegels vereist, dat zou een veel
 * complexere volledige zetgenerator vergen). "Langste woord" i.p.v. eerste
 * match: een nuttigere hint, meer letters gemarkeerd. Geeft null als er met
 * dit rek geen enkel woord van minstens 2 letters te spellen is.
 */
export function findHint(rack: string[]): HintResult | null {
  let best: HintResult | null = null;
  for (const w of ALL_WORDS) {
    if (w.length < 2 || w.length > rack.length) continue;
    if (best && w.length <= best.word.length) continue;
    const upper = w.toUpperCase();
    const used = tryConsume(upper, rack);
    if (used) best = { word: upper, usedIndices: used };
  }
  return best;
}
