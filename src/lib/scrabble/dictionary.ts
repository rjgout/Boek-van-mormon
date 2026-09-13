import bomWords from "../../../prisma/bomWords.json";

// Woordenlijst = alle unieke woorden (incl. eigennamen als "Nephi", "Lehi",
// ...) die daadwerkelijk in de Boek van Mormon-tekst voorkomen — bewust
// geen algemeen Nederlands woordenboek. Diakritische tekens zijn al
// verwijderd bij het genereren (zie het extractiescript), zodat dit precies
// aansluit op de accentloze Scrabble-stenen.
const WORD_SET = new Set<string>(bomWords as string[]);

export function isValidWord(word: string): boolean {
  return WORD_SET.has(word.toLowerCase());
}

// Voor de hint-functie (src/lib/scrabble/hint.ts), die op zoek gaat naar
// een woord dat met de letters op een rek te spellen is.
export const ALL_WORDS: readonly string[] = bomWords as string[];
