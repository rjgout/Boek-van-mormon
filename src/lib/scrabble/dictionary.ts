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
