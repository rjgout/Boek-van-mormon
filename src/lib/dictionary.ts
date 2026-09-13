import bomWordCounts from "../../prisma/bomWordCounts.json";

export interface DictionaryEntry {
  word: string;
  count: number;
}

// Zelfde brontekst en exact dezelfde extractie (regex + kleine letters +
// diakritische tekens strippen) als prisma/bomWords.json, zodat deze lijst
// altijd één-op-één overeenkomt met wat geldig is in Scrabble (zie
// src/lib/scrabble/dictionary.ts) — dit woordenboek is dus ook bruikbaar
// als Scrabble-hulpmiddel. Statisch gegenereerd i.p.v. live opgeteld uit de
// database, om dezelfde reden dat bomWords.json dat ook is.
const ENTRIES: DictionaryEntry[] = Object.entries(bomWordCounts as Record<string, number>)
  .map(([word, count]) => ({ word, count }))
  .sort((a, b) => a.word.localeCompare(b.word, "nl"));

export function getDictionaryEntries(): DictionaryEntry[] {
  return ENTRIES;
}
